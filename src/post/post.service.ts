import { Types } from "mongoose";
import { Post } from "./models/post.model";
import { checkIfPostExists } from "@utils/lib";
import { Comment, IPost, Like } from "./interfaces/posts.interface";
import { getCacheKey, setCacheKey } from "@config/cache";
import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from "@shared/exceptions/common.exception";


export class PostService {

    public async getPostsByUser(userID: string) {

        // Check cache for matching key
        const value = await getCacheKey(`posts/user/${userID}`);

        if (value) return { fromCache: true, data: JSON.parse(value) };

        // If value doesn't exist, load from DB and set new cache key
        const posts = await Post.find({ user: userID }).exec();

        if (!posts.length) throw new NotFoundException('User has no posts');

        await setCacheKey(`posts/user/${userID}`, posts);

        return { fromCache: false, data: posts };

    };

    public async createPost(userID: string, postContent: string, postTitle: string) {

        // Check if the user has an existing post with the same title
        const isPostExists = await Post.find({ user: userID, postTitle })

        if (isPostExists) throw new ConflictException('User has an existing post with the same title');

        const newPost = new Post({
            user: new Types.ObjectId(userID),
            postTitle,
            postContent
        });

        await newPost.save();

        return newPost;

    }

    public async addComments(postID: string, userID: string, newComment: string) {

        const post: IPost = await checkIfPostExists(postID)

        const userMongoID = new Types.ObjectId(userID);

        switch (true) {
            case !post.comments.length:
            case !post.comments.find(comment => comment.commentUser.equals(userMongoID)):

                const comments = new Comment(userMongoID, [{ commentText: newComment, commentDate: new Date(Date.now()) }]);

                post.comments = [...post.comments, comments];

                await post.save();

                break;
            case post.comments.some(comment => comment.commentUser.equals(userMongoID)):

                const commentIndex: number = post.comments.findIndex(comment => comment.commentUser.equals(userMongoID));

                post.comments[commentIndex].commentList = [
                    ...post.comments[commentIndex].commentList,
                    { commentText: newComment, commentDate: new Date(Date.now()) }
                ];

                await post.save();

                break;
        };

        return post;

    }

    public async deleteComment(postID: string, userID: string, commentID: string) {

        const post: IPost = await checkIfPostExists(postID);

        const commentIndex: number = post.comments.findIndex(comment => comment.commentUser.equals(new Types.ObjectId(userID)));

        if (commentIndex === -1) throw new NotFoundException('User has not commented on this post');

        const commentIndexInCommentList: number = post.comments[commentIndex].commentList.findIndex(comment => comment._id!.equals(new Types.ObjectId(commentID)));

        if (commentIndexInCommentList === -1) throw new NotFoundException('Comment not found');

        post.comments[commentIndex].commentList.splice(commentIndexInCommentList, 1);

        await post.save();

        return post;
    };

    public async likePost(postID: string, userID: string) {

        const post: IPost = await checkIfPostExists(postID);

        const userMongoID = new Types.ObjectId(userID);

        switch (true) {
            case !post.likes.length || !post.likes.some(like => like.byUser.equals(userMongoID)):
                const newLike = new Like(userMongoID, new Date(Date.now()));
                post.likes = [...post.likes, newLike];
                await post.save();
                break;
            case post.likes.some(like => like.byUser.equals(userMongoID)):
                throw new ForbiddenException('You have already liked this post')
        }

        return post;

    };

    public async unLikePost(postID: string, userID: string) {

        const post: IPost = await checkIfPostExists(postID);

        const likeIndex: number = post.likes.findIndex(like => like.byUser.equals(new Types.ObjectId(userID)));

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