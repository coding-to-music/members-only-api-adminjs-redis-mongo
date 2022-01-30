import { Document, Types } from "mongoose";

export interface IProifle extends Document {
    user: Types.ObjectId;
    bio: string;
    address: string,
    phoneNumber: number,
    education: IEducation[],
    experience: IExperience[],
    social: ISocial,
}

export interface IEducation {
    school: string,
    degress: string,
    field: string,
    from: Date,
    to: Date,
    current: boolean
};

export interface IExperience {
    jobTitle: string,
    company: string,
    location: string,
    from: Date,
    to: Date,
    description: string
}

export interface ISocial {
    github: string,
    linkedin: string,
    twitter: string
}