import { Types } from "mongoose";
import gravatar from "gravatar";
import { User } from "./models/user.model";
import { Post } from "@post/models/post.model";
import { Profile } from "@profile/models/profile.model";
import { ConflictException, NotFoundException } from "@shared/exceptions/common.exception";
import { sendMail } from "@utils/sendMail";

export class UserService {

    public async createUser(body: any): Promise<void> {

        const { email, firstName, lastName, confirmPassword, img } = body;

        const foundUser = await User.findOne({ email: email }).exec();
        if (foundUser) throw new ConflictException('User already exists');

        const avatar = gravatar.url(email, { s: '100', r: 'pg', d: 'retro' }, true);

        const user = new User({
            name: `${firstName} ${lastName}`,
            email,
            password: confirmPassword,
            avatar: avatar ?? img ?? ''
        });

        await user.save();

        const mailOptions: [string, string, string, string] = [
            email,
            'New Account Creation',
            `Welcome to Members Only`,
            `<p>Dear ${firstName} ${lastName}, Welcome to the Members Only platform, we are glad to have you onboard</p>`
        ];

        await sendMail(...mailOptions);
    };

    public async updateUser(_id: string, body: any) {

        const foundUser = await User.findOne({ _id }).exec();

        if (foundUser) {

            const updatedUser = Object.assign(foundUser, body)

            await updatedUser.save()

            return true

        } else {
            throw new NotFoundException(`User with ID: ${_id} does not exist`)
        };
    }

    public async deleteUser(_id: string): Promise<void> {

        await Post.deleteMany({ user: _id }).exec();

        const userPostComments = await Post.find({}).elemMatch('comments', { commentUser: _id }).exec();

        if (userPostComments.length) {
            userPostComments.forEach(async post => {
                const commentIndex = post.comments.findIndex(comment => comment.commentUser.equals(new Types.ObjectId(_id)));
                if (commentIndex !== -1) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                }
            });
        };

        const userPostLikes = await Post.find({}).elemMatch('likes', { byUser: _id }).exec();

        if (userPostLikes.length) {
            userPostLikes.forEach(async post => {
                const likeIndex = post.likes.findIndex(like => like.byUser.equals(new Types.ObjectId(_id)));
                if (likeIndex !== -1) {
                    post.likes.splice(likeIndex, 1);
                    await post.save();
                }
            });
        }

        await Profile.deleteOne({ user: _id }).exec();

        await User.deleteOne({ _id }).exec();
    }
}