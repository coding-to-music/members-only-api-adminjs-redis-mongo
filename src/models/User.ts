import { compare, hash } from 'bcrypt';
import { Schema, model } from 'mongoose';
import { decode, JwtPayload } from 'jsonwebtoken';
import { IUser, Role } from '@interfaces/users.interface';
import { generateRandomCode, createLoginTokens } from '@utils/lib';
import { ITokens, IValidate, IVerify } from '@interfaces/auth.interface';


const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, immutable: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    lastLogin: { type: Date, default: Date.now },
    roles: { type: [String], default: [Role.GUEST] },
    resetPassword: {
        code: { type: String, default: '' },
        expiresBy: { type: Date, default: '' }
    },
    refreshToken: {
        token: { type: String, default: '' },
        expiresBy: { type: Date, default: '' }
    },
    tokenVersion: { type: Number, default: 0 },
    twoFactor: {
        base32Secret: { type: String, default: '' },
        enabled: { type: Boolean, default: false },
        passwordValidated: { type: Boolean, default: false }
    }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = await hash(this.password, 10);
    }
    next();
});

UserSchema.pre('findOne', async function (next) {
    await this.model.findOneAndUpdate(this.getFilter().email, { '$set': { 'lastLogin': Date.now() } }, { new: true });
    next();
});

UserSchema.methods.generateCode = async function (): Promise<string | null> {
    const code = await generateRandomCode(3);
    this.resetPassword.code = await hash(code!, 10);
    this.resetPassword.expiresBy = new Date(Date.now() + 300000);
    this.save();
    return code;
};

UserSchema.methods.verifyCode = async function (code: string | Buffer): Promise<IVerify> {
    const validCode = compare(code, this.resetPassword.code);
    const codeNotExpired = (Date.now() - new Date(this.resetPassword.expiresBy).getTime()) < 300000;
    return { validCode, codeNotExpired };
};

UserSchema.methods.generateTokens = async function (usr: IUser): Promise<ITokens> {
    const { accessToken, refreshToken } = await createLoginTokens(usr);
    this.refreshToken.token = refreshToken;
    const decodedJwt: JwtPayload = decode(refreshToken) as JwtPayload;
    this.refreshToken.expiresBy = new Date(decodedJwt.exp! * 1000);
    this.tokenVersion++;
    this.lastLogin = new Date(Date.now());
    await this.save();
    return { accessToken, refreshToken };
}

UserSchema.methods.validateRefreshToken = async function (refreshToken: string, tokenVersion: number): Promise<IValidate> {
    const validToken = this.refreshToken.token === refreshToken;
    const refreshTokenNotExpired = (new Date(this.resetPassword.expiresBy).getTime() - Date.now()) < 604800000;
    const tokenVersionValid = (this.tokenVersion - tokenVersion) === 1;
    return { validToken, refreshTokenNotExpired, tokenVersionValid };
}

UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return compare(password, this.password);
};

export default model<IUser>('User', UserSchema);