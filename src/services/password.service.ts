import User from '@models/User';
import { sendMail } from '@utils/sendMail';
import {
    ForbiddenException,
    NotFoundException,
} from '@exceptions/common.exception';


export class PasswordService {

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

        const { email, new_password, code } = body;

        const user = await User.findOne({ email }).exec();
        if (!user) throw new NotFoundException(`No user with email: ${email} found`);

        const { validCode, codeNotExpired } = await user.verifyCode(code);
        if (!validCode || !codeNotExpired) throw new ForbiddenException('Verification code is invalid or it has expired');

        user.password = new_password;
        await user.save();

        const { password, resetPassword, refreshToken, tokenVersion, ...data } = user._doc;

        return data

    }

    public async changePassword(_id: string, oldPassword: string, newPassword: string) {

        const user = await User.findById(_id).exec();
        if (!user) throw new NotFoundException(`No user with id: ${_id} found`);

        const validPassword = await user.validatePassword(oldPassword);
        if (!validPassword) throw new ForbiddenException('Old password is invalid');

        user.password = newPassword;
        await user.save();

        const { password, resetPassword, refreshToken, tokenVersion, ...data } = user._doc;

        return data;

    }

};