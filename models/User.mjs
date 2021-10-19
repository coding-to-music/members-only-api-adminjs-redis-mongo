import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { generateRandomCode } from '../utils/generateKey.mjs'

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
        expiresIn: { type: Date, default: '' }
    }
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
})

UserSchema.methods.generateCode = async function () {
    const code = await generateRandomCode(3);
    this.resetPassword.code = await bcrypt.hash(code, 10);
    this.resetPassword.expiresIn = Date.now() + 300000;
    this.save();
    return code
}

UserSchema.methods.verifyCode = async function (code) {
    const validCode = await bcrypt.compare(code, this.resetPassword.code);
    const codeNotExpired = (Date.now() - new Date(this.resetPassword.expiresIn)) < 300000;
    return { validCode, codeNotExpired };
}

export default mongoose.model('User', UserSchema);