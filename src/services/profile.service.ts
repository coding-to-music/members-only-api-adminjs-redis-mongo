import { Types } from 'mongoose';
import Profile from '@models/Profile';
import {
    ConflictException,
    NotFoundException,
} from '@exceptions/common.exception';


export class ProfileService {

    public async getUserProfile(userID: string) {

        const profile = await Profile.findOne({ user: userID }).exec();

        if (!profile) throw new NotFoundException(`No Profile found for user with ID: ${userID}`);

        return profile;

    };

    public async createProfile(userID: string, body: any) {

        // Check if user already has a profile
        const isProfileExists = await Profile.findOne({ user: userID })

        if (!isProfileExists) throw new ConflictException('User Already has a Profile');

        const profileToCreate = new Profile({
            user: new Types.ObjectId(userID),
            bio: body.bio,
            address: body.address,
            phoneNumber: +body.phoneNumber,
            education: body.education,
            experience: body.experience,
            social: body.social,
        });

        await profileToCreate.save();

        return profileToCreate;

    }

}