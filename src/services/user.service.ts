import gravatar from 'gravatar';
import User from '@models/User';
import Post from '@models/Post';
import Profile from '@models/Profile';
import { ConflictException, NotFoundException } from '@exceptions/common.exception';
import { sendMail } from '@utils/sendMail';
import { Types } from 'mongoose';


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

        const userPostComments = await Post.find({}).elemMatch('comments', { comment_user: _id }).exec();

        if (userPostComments.length) {
            userPostComments.forEach(async post => {
                const commentIndex = post.comments.findIndex(comment => comment.comment_user.equals(new Types.ObjectId(_id)));
                if (commentIndex !== -1) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                }
            });
        };

        const userPostLikes = await Post.find({}).elemMatch('likes', { like_user: _id }).exec();

        if (userPostLikes.length) {
            userPostLikes.forEach(async post => {
                const likeIndex = post.likes.findIndex(like => like.like_user.equals(new Types.ObjectId(_id)));
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