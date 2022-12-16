import { compare, hash } from "bcrypt";
import { Schema, model } from "mongoose";
import { decode, JwtPayload } from "jsonwebtoken";
import { IUser, Role } from "@user/interfaces/users.interface";
import { ITokens, IValidate, IVerify } from "@auth/interfaces/auth.interface";
import { generateRandomText, createLoginTokens } from "@utils/crypt";

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, immutable: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    lastLogin: { type: Date, default: Date.now },
    roles: { type: [String], default: [Role.GUEST] },
    personalKey: { type: String, default: generateRandomText(32, 'lower') },    // EXPERIMENTAL PROPERTY, TO BE APPLIED WITH TOKEN SIGNING AND LOGOUT METHOD
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

UserSchema.methods.generateCode = async function () {
    const code = generateRandomText(3, 'upper');
    this.resetPassword.code = await hash(code!, 10);
    this.resetPassword.expiresBy = new Date(Date.now() + 300000);
    await this.save();
    return code;
};

UserSchema.methods.verifyCode = async function (code: string | Buffer): Promise<IVerify> {
    const validCode = compare(code, this.resetPassword.code);
    const codeNotExpired = (Date.now() - new Date(this.resetPassword.expiresBy).getTime()) < 300000;
    return { validCode, codeNotExpired };
};

UserSchema.methods.generateTokens = async function (user: IUser): Promise<ITokens> {
    const { accessToken, refreshToken } = await createLoginTokens(user);
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

UserSchema.methods.validatePassword = async function (plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.password);
};

UserSchema.methods.logout = async function () {
    this.personalKey = generateRandomText(32, 'lower');
    await this.save();
}

export const User = model<IUser>('User', UserSchema);