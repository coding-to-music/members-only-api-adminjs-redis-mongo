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
import { sendMail } from '@utils/sendMail';


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

    public async validateTwoFactor(email: string, otpToken: string) {

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

    public async refreshToken(jit: string) {

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

    public async getVerificationCode(email: string) {

        const user = await User.findOne({ email }).exec();
        if (!user) throw new NotFoundException(`User with email ${email} not found`);

        const code = await user.generateCode();
        const mailOptions: [string, string, string, string] = [
            email,
            'Verification code',
            `Your verification code is ${code}`,
            `<p>Please use this code: <strong style='color: red'>${code}</strong> to continue your password reset</p>`
        ];

        await sendMail(...mailOptions);

    }

    public async resetPassword(body: any) {

        const { email, newPassword, code } = body;

        const user = await User.findOne({ email }).exec();
        if (!user) throw new NotFoundException(`No user with email: ${email} found`);

        const { validCode, codeNotExpired } = await user.verifyCode(code);
        if (!validCode || !codeNotExpired) throw new ForbiddenException('Verification code is invalid or it has expired');

        user.password = newPassword;
        await user.save();

        const { password, resetPassword, refreshToken, tokenVersion, ...data } = user._doc;

        return data

    }

    public async changePassword(_id: string, currentPassword: string, newPassword: string) {

        const user = await User.findById(_id).exec();
        if (!user) throw new NotFoundException(`No user with id: ${_id} found`);

        const validPassword = await user.validatePassword(currentPassword);
        if (!validPassword) throw new ForbiddenException('Old password is invalid');

        user.password = newPassword;
        await user.save();

        const { password, resetPassword, refreshToken, tokenVersion, ...data } = user._doc;

        return data;

    }

}