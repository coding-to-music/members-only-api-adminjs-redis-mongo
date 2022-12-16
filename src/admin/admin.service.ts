import { Post } from "@post/models/post.model";
import { Profile } from "@profile/models/profile.model";
import { User } from "@user/models/user.model";
import { NotFoundException } from "@shared/exceptions/common.exception";
import { getCacheKey, setCacheKey } from "@config/cache";


export class AdminService {

    public async getAllUsers() {

        const value = await getCacheKey('all_users');

        if (value) {

            return { fromCache: true, allUsers: JSON.parse(value) }

        } else {

            const allUsers = await User.find({}, 'name email lastLogin avatar roles').exec();

            await setCacheKey('all_users', allUsers);

            return { fromCache: false, allUsers };
        };
    };

    public async getUserByID(id: string) {

        const value = await getCacheKey(`admin/users/${id}`);

        if (value) return { fromCache: true, user: JSON.parse(value) };

        const user = await User.findOne({ _id: id }).exec();

        if (user) {

            await setCacheKey(`admin/users/${id}`, user);

            return { fromCache: false, user };

        } else {

            throw new NotFoundException(`User with ID: ${id}`);
        }

    };

    public async getAllProfiles() {

        const value = await getCacheKey('all_profiles');

        if (value) {

            return { fromCache: true, allProfiles: JSON.parse(value) }

        } else {

            const allProfiles = await Profile.find({}).exec();

            await setCacheKey('all_profiles', allProfiles);

            return { fromCache: false, allProfiles };
        };
    };

    public async getProfileByID(id: string) {

        const value = await getCacheKey(`admin/profiles/${id}`);

        if (value) return { fromCache: true, profile: JSON.parse(value) };

        const profile = await Profile.findOne({ _id: id }).exec();

        if (profile) {

            await setCacheKey(`admin/profiles/${id}`, profile);

            return { fromCache: false, profile };

        } else {

            throw new NotFoundException(`Profile with ID: ${id}`);
        }

    };

    public async getAllPosts() {

        const value = await getCacheKey('all_posts')

        if (value) return { fromCache: true, allPosts: JSON.parse(value) }

        const allPosts = await Post.find({}).exec();

        await setCacheKey('all_posts', allPosts);

        return { fromCache: false, allPosts };

    };

    public async getPostByID(id: string) {

        const value = await getCacheKey(`admin/posts/${id}`);

        if (value) return { fromCache: true, post: JSON.parse(value) };

        const post = await Post.findOne({ _id: id }).exec();

        if (post) {

            await setCacheKey(`admin/posts/${id}`, post);

            return { fromCache: false, post };

        } else {

            throw new NotFoundException(`Post with ID: ${id}`);
        }

    };

}