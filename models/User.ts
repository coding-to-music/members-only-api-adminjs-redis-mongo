import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { decode, JwtPayload } from 'jsonwebtoken';
import { IUser } from '@interfaces/users.interface';
import { generateRandomCode, tokenGenerator } from '@utils/generateData';
import { ITokens, IValidate, IVerify } from '@interfaces/auth.interface';


const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, immutable: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    lastLogin: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false },
    isMember: { type: Boolean, default: false },
    resetPassword: {
        code: { type: String, default: '' },
        expiresBy: { type: Date, default: '' }
    },
    refreshToken: {
        token: { type: String, default: '' },
        expiresBy: { type: Date, default: '' }
    },
    tokenVersion: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

UserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.pre('findOne', async function (next) {
    await this.model.findOneAndUpdate(this.getFilter().email, { '$set': { 'lastLogin': Date.now() } }, { new: true });
    next();
});

UserSchema.methods.generateCode = async function (): Promise<string | null> {
    const code = await generateRandomCode(3);
    this.resetPassword.code = bcrypt.hashSync(code!, 10);
    this.resetPassword.expiresBy = new Date(Date.now() + 300000);
    this.save();
    return code;
};

UserSchema.methods.verifyCode = async function (code: string | Buffer): Promise<IVerify> {
    const validCode = bcrypt.compare(code, this.resetPassword.code);
    const codeNotExpired = (Date.now() - new Date(this.resetPassword.expiresBy).getTime()) < 300000;
    return { validCode, codeNotExpired };
};

UserSchema.methods.generateTokens = async function (usr: IUser): Promise<ITokens> {
    const { token, refresh_token } = await tokenGenerator(usr);
    this.refreshToken.token = refresh_token;
    const decodedJwt: JwtPayload = decode(refresh_token) as JwtPayload;
    this.refreshToken.expiresBy = new Date(decodedJwt.exp! * 1000);
    this.tokenVersion++;
    this.lastLogin = new Date(Date.now());
    await this.save();
    return { token, refresh_token };
}

UserSchema.methods.validateRefreshToken = async function (token: any): Promise<IValidate> {
    const validToken = this.refreshToken.token === token;
    const refreshTokenNotExpired = (new Date(this.resetPassword.expiresBy).getTime() - Date.now()) < 604800000;
    const tokenVersionValid = (this.tokenVersion - token.token_version) === 1;
    return { validToken, refreshTokenNotExpired, tokenVersionValid };
}

UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export default model<IUser>('User', UserSchema);