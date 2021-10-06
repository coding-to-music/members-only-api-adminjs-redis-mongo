import mongoose, { Schema } from "mongoose";

const ProfileSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    bio: { type: String },
    address: { type: String, required: true },
    phoneNumber: { type: Number, min: 9, required: true },
    education: [{
        school: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String, required: true },
        from: { type: Date, required: true },
        to: { type: Date },
        current: { type: Boolean, default: false }
    }],
    social: { 
        github: { type: String }, 
        linkedin: { type: String }, 
        twitter: { type: String } 
    },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Profile', ProfileSchema);