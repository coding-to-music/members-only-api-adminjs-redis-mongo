import { toDataURL } from 'qrcode';
import { JwtPayload, verify } from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
    UnAuthorizedException
} from '@exceptions/common.exception';
import User from '@models/User';
import { IUser } from '@interfaces/users.interface';
import { ENV } from '@utils/validateEnv';


export class AuthService {

    public async loginUser(email: string, password: string) {

        const user = await User.findOne({ email }).exec();
        if (!user) throw new NotFoundException(`User with email: ${email} not found`)

        const validPassword: boolean = await user.validatePassword(password);
        if (!validPassword) throw new UnAuthorizedException('Invalid Login Credentials');

        // Check if user has 2FA enabled and respond with uesr's email & 2FA status, else
        // Generate new Tokens and send them to the client
        if (user.twoFactor.enabled) {

            // This is to prevent users from calling the validate OTP endpoint without validating their email/passwords first
            user.twoFactor.passwordValidated = true;
            await user.save();

            const { enabled: is2FAEnabled } = user.twoFactor;

            return { email: user.email, is2FAEnabled }

        } else {

            const { accessToken, refreshToken } = await user.generateTokens(user);
            const { enabled: is2FAEnabled } = user.twoFactor;

            return { accessToken, refreshToken, is2FAEnabled };
        }
    };

    public async verifyTwoFactor(otpToken: string, user: IUser) {

        const { twoFactor } = user;

        const isVerified = speakeasy.totp.verify({
            secret: twoFactor.base32Secret,
            encoding: 'base32',
            token: otpToken
        });

        if (isVerified) {

            user.twoFactor.enabled = true;
            await user.save();

        } else {
            throw new ForbiddenException('Invalid OTP Token')
        }
    };

    public async loginValidateTwoFactor(email: string, otpToken: string) {

        const userExists = await User.findOne({ email }).exec();

        if (userExists) {

            const { twoFactor } = userExists;

            if (!twoFactor.passwordValidated) throw new UnAuthorizedException('Please Validate Your Password To Proceed')

            const isVerified = speakeasy.totp.verify({
                secret: twoFactor.base32Secret,
                encoding: 'base32',
                token: otpToken,
                window: 1
            });

            if (isVerified) {

                // Reverse Password Validated state to default
                // This is to prevent users from calling the validate OTP endpoint without validating their email/passwords first
                userExists.twoFactor.passwordValidated = false;
                await userExists.save()

                const { accessToken, refreshToken } = await userExists.generateTokens(userExists);
                const { enabled: is2FAEnabled } = userExists.twoFactor;

                return { accessToken, refreshToken, is2FAEnabled };
            }

            throw new UnAuthorizedException('Invalid Login Credentials')

        } else {
            throw new UnAuthorizedException('Invalid Login Credentials');
        }
    };

    public async registerTwofactor(user: IUser) {

        const { enabled: is2FAEnabled } = user.twoFactor;

        if (is2FAEnabled) {

            throw new ConflictException(`2FA Already Enabled for User`);

        } else {

            const { base32, otpauth_url } = speakeasy.generateSecret({
                name: 'Members Only'
            });

            user.twoFactor.base32Secret = base32;
            await user.save();

            return await toDataURL(otpauth_url as string);

        }

    };

    public async postRefreshToken(jit: string) {

        // Verify refresh token in request
        const REFRESH_TOKEN_PUBLIC_KEY = Buffer.from(ENV.REFRESH_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');
        const verifiedToken = verify(jit, REFRESH_TOKEN_PUBLIC_KEY) as JwtPayload;

        // Check if user exists in DB
        const user = await User.findOne({ _id: verifiedToken.sub });
        if (!user) throw new NotFoundException('User not found');

        // Check if refresh token is valid
        const { validToken, refreshTokenNotExpired, tokenVersionValid } = await user.validateRefreshToken(jit, verifiedToken.tokenVersion);

        if (!validToken) throw new ForbiddenException('Invalid Refresh token');

        if (!refreshTokenNotExpired) throw new ForbiddenException('Refresh Token has expired, Please initiate a new login request');

        if (!tokenVersionValid) throw new ForbiddenException('Token Invalid')

        // Generate new Tokens and send them to the client
        const { accessToken, refreshToken } = await user.generateTokens(user);
        const { enabled: is2FAEnabled } = user.twoFactor;

        return { accessToken, refreshToken, is2FAEnabled };

    };

}