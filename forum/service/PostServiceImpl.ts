import PostService from "./PostService";
import PostDto from "../dto/PostDto";
import {IPost, Post as P} from "../models/Post";
import Comment from "../models/Comment";

export default class PostServiceImpl implements PostService {
    private mapDocToPostDTO (post: IPost): PostDto {
        return new PostDto(
            post.id,
            post.title,
            post.content,
            post.author,
            post.dateCreated,
            Array.from(post.tags || []),
            post.likes,
            post.comments.map(c => new Comment(c.user, c.message, c.likes, c.dateCreated))
        );
    }


    async createPost(author: string, title: string, content: string, tags: Set<string>): Promise<PostDto> {
        const checkDuplicate = await P.findOne({ author, title, content });
        if (checkDuplicate) throw new Error("The post already exists");

        const newPost = new P({ title, content, author, tags });
        await newPost.save();
        if (!newPost.id) throw new Error("Error saving DB");

        return this.mapDocToPostDTO(newPost);
    }

    async findPostById(id: string): Promise<PostDto> {
        const post = await this.findPost(id);
        return this.mapDocToPostDTO(post);
    }

    async updatePost(id: string, title?: string, content?: string, tags?: Set<string>): Promise<PostDto> {
        if (!title && !content && !tags) throw new Error("Error in request: not valid fields for updating");

        const post = await this.findPost(id);
        post.title = title || post.title;
        post.content = content || post.content;
        if (tags) post.tags = Array.from(tags) || post.tags;

        const updatedPost = await post.save();
        if (!updatedPost) throw new Error("Error saving update in DB");

        return this.mapDocToPostDTO(post);
    }

    async deletePost(id: string): Promise<PostDto> {
        const post = await P.findByIdAndDelete(id);
        if (!post) throw new Error(`Post with id ${id} not found`);

        return this.mapDocToPostDTO(post);
    }

    async findPostsByAuthor(author: string): Promise<PostDto[]> {
        const res = await P.find({ author });
        return res.map(this.mapDocToPostDTO);
    }

    async findPostsByPeriod(from: Date, to: Date = new Date()): Promise<PostDto[]> {
        const res = await P.find({ dateCreated: { $gt: from, $lt: to } });
        return res.map(this.mapDocToPostDTO);
    }

    async findPostsByTags(tags: Set<string>): Promise<PostDto[]> {
        const res = await P.find({ tags: { $in: Array.from(tags) } });
        return res.map(this.mapDocToPostDTO);
    }

    async addComment(postId: string, user: string, message: string): Promise<PostDto> {
        const post = await this.findPost(postId);
        post.comments.push({ user, message } as Comment);
        await post.save();
        return this.mapDocToPostDTO(post);
    }

    async addLike(postId: string): Promise<{ result: string }> {
        const post = await this.findPost(postId);
        post.likes += 1;
        await post.save();
        return { result: "Like added +1" };
    }

    async findPost(id: string) {
        const post = await P.findById(id);
        if (!post) throw new Error(`Post with id ${id} not found`);
        return post;
    }

    async getPosts(): Promise<PostDto[]> {
        return (await P.find()).map(this.mapDocToPostDTO);
    }
}
