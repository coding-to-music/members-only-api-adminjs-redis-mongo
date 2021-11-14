import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { generateRandomCode, tokenGenerator } from '@utils/generateData';
import jwt, { JwtPayload } from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
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
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

UserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.pre('findOne', async function (next) {
    await this.model.findOneAndUpdate(this.getFilter().email, { '$set': { 'lastLogin': Date.now() } }, { new: true });
    next();
});

UserSchema.methods.generateCode = async function () {
    const code = await generateRandomCode(3);
    this.resetPassword.code = bcrypt.hash(code!, 10);
    this.resetPassword.expiresBy = Date.now() + 300000;
    this.save();
    return code;
};

UserSchema.methods.verifyCode = async function (code) {
    const validCode = bcrypt.compare(code, this.resetPassword.code);
    const codeNotExpired = (Date.now() - new Date(this.resetPassword.expiresBy).getTime()) < 300000;
    return { validCode, codeNotExpired };
};

UserSchema.methods.generateTokens = async function (usr) {
    const { token, refresh_token } = await tokenGenerator(usr);
    this.refreshToken.token = refresh_token;
    const decodedJwt: JwtPayload = jwt.decode(refresh_token) as JwtPayload;
    this.refreshToken.expiresBy = new Date(decodedJwt.exp! * 1000);
    await this.save();
    return { token, refresh_token };
}

UserSchema.methods.validateRefreshToken = async function (token) {
    const validToken = this.refreshToken.token === token;
    const refreshTokenNotExpired = (new Date(this.resetPassword.expiresBy).getTime() - Date.now()) < 604800000;
    return { validToken, refreshTokenNotExpired };
}

export default mongoose.model('User', UserSchema);