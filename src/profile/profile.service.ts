import { Types } from "mongoose";
import { Profile } from "./models/profile.model";
import { ConflictException, NotFoundException } from "@shared/exceptions/common.exception";

export class ProfileService {

    public async getProfileByUser(userID: string) {

        const profile = await Profile.findOne({ user: userID }).exec();

        if (profile) {

            return profile;

        } else {

            throw new NotFoundException(`No Profile found for user with ID: ${userID}`);
        }

    };

    public async createProfile(userID: string, body: any) {

        // Check if user already has a profile
        const profileExists = await Profile.findOne({ user: userID })

        if (profileExists) throw new ConflictException('User Already has a Profile');

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

    public async updateProfile(userID: string, body: any) {

        const foundProfile = await Profile.findOne({ user: userID }).exec();

        if (foundProfile) {

            const updatedProfile = Object.assign(foundProfile, body);

            await updatedProfile.save();

            return true

        } else {

            throw new NotFoundException(`No Profile found for user with ID: ${userID}`)

        };
    }

    public async deleteProfile(userID: string) {

        const profileToDelete = await this.getProfileByUser(userID)

        await profileToDelete.remove();

        return true

    }

}