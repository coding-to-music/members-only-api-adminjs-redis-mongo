import { Schema, model } from "mongoose";
import { IProifle } from "@interfaces/profiles.interface";

const ProfileSchema = new Schema<IProifle>({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    bio: { type: String },
    address: { type: String, required: true },
    phoneNumber: { type: Number, min: 9, required: true },
    education: [
        {
            school: { type: String, required: true },
            degree: { type: String, required: true },
            field: { type: String, required: true },
            from: { type: Date, required: true },
            to: { type: Date },
            current: { type: Boolean, default: false }
        }
    ],
    experience: [
        {
            jobTitle: { type: String, required: true },
            company: { type: String, required: true },
            location: { type: String, required: true },
            from: { type: Date, required: true },
            to: { type: Date },
            description: { type: String }
        }
    ],
    social: {
        github: { type: String },
        linkedin: { type: String },
        twitter: { type: String }
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default model<IProifle>('Profile', ProfileSchema);