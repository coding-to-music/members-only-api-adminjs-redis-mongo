import Post from '@models/Post';
import { checkIfPostExists } from '@utils/lib';
import { Comment, Like } from '@interfaces/posts.interface';
import { Types } from 'mongoose';
import { IPost } from '@interfaces/posts.interface';
import { getCacheKey, setCacheKey } from '@config/cache';
import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from '@exceptions/common.exception';


export class PostService {

    public async getAllPosts() {

        const value = await getCacheKey('all_posts')

        if (value) return { fromCache: true, data: JSON.parse(value) }

        const posts = await Post.find({}).exec();

        await setCacheKey('all_posts', posts);

        return { fromCache: false, data: posts };

    };

    public async getPostsByUser(_id: string) {

        // Check cache for matching key
        const value = await getCacheKey(`posts/${_id}`);

        if (value) return { fromCache: true, data: JSON.parse(value) };

        // If value doesn't exist, load from DB and set new cache key
        const posts = await Post.find({ user: _id }).exec();

        if (!posts.length) throw new NotFoundException('User has no posts');

        await setCacheKey(`posts/${_id}`, posts);

        return { fromCache: false, data: posts };

    };

    public async getPostById(id: string) {

        // Check cache for matching key
        const value = await getCacheKey(`posts/${id}`)

        if (value) return { fromCache: true, data: JSON.parse(value) };

        // If value doesn't exist, load from DB and set new cache key
        const post = await checkIfPostExists(id);

        await setCacheKey(`posts/${id}`, post);

        return { fromCache: false, data: post };

    };

    public async createPost(_id: string, postContent: string, postTitle: string) {

        // Check if the user has an existing post with the same title
        const isPostExists = await Post.find({ user: _id, postTitle })

        if (isPostExists) throw new ConflictException('User has an existing post with the same title');

        const newPost = new Post({
            user: new Types.ObjectId(_id),
            postTitle,
            postContent
        });

        await newPost.save();

        return newPost;

    }

    public async addComments(postID: string, userID: string, newComment: string) {

        const post = await checkIfPostExists(postID)

        const userMongoID = new Types.ObjectId(userID);

        switch (true) {
            case !post.comments.length:
            case !post.comments.find(comment => comment.comment_user.equals(userMongoID)):

                const comments = new Comment(userMongoID, [{ comment: newComment, comment_date: new Date(Date.now()) }]);

                post.comments = [...post.comments, comments];

                await post.save();

                break;
            case post.comments.some(comment => comment.comment_user.equals(userMongoID)):

                const commentIndex: number = post.comments.findIndex(comment => comment.comment_user.equals(userMongoID));

                post.comments[commentIndex].comment_list = [
                    ...post.comments[commentIndex].comment_list,
                    { comment: newComment, comment_date: new Date(Date.now()) }
                ];

                await post.save();

                break;
        };

        return post;

    }

    public async deleteComment(postID: string, userID: string, commentID: string) {

        const post = await checkIfPostExists(postID);

        const commentIndex: number = post.comments.findIndex(comment => comment.comment_user.equals(new Types.ObjectId(userID)));

        if (commentIndex === -1) throw new NotFoundException('User has not commented on this post');

        const commentIndexInCommentList: number = post.comments[commentIndex].comment_list.findIndex(comment => comment._id!.equals(new Types.ObjectId(commentID)));

        if (commentIndexInCommentList === -1) throw new NotFoundException('Comment not found');

        post.comments[commentIndex].comment_list.splice(commentIndexInCommentList, 1);

        await post.save();

        return post;
    };

    public async likePost(postID: string, userID: string) {

        const post = await checkIfPostExists(postID);

        const userMongoID = new Types.ObjectId(userID);

        switch (true) {
            case !post.likes.length || !post.likes.some(like => like.like_user.equals(userMongoID)):
                const newLike = new Like(userMongoID, new Date(Date.now()));
                post.likes = [...post.likes, newLike];
                await post.save();
                break;
            case post.likes.some(like => like.like_user.equals(userMongoID)):
                throw new ForbiddenException('You have already liked this post')
        }

        return post;

    };

    public async unLikePost(postID: string, userID: string) {

        const post = await checkIfPostExists(postID);

        const likeIndex: number = post.likes.findIndex(like => like.like_user.equals(new Types.ObjectId(userID)));

        if (likeIndex === -1) throw new NotFoundException('User has not liked this post')

        post.likes.splice(likeIndex, 1);
        await post.save();

        return post;

    };

    public async deletePost(postID: string, userID: string) {

        const post = await checkIfPostExists(postID) as IPost;

        if (!post.user.equals(new Types.ObjectId(userID)))
            throw new ForbiddenException('You cannot delete this post');

        await post.remove();

    }

}