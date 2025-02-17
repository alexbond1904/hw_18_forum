import {Body, Controller, Delete, Get, Param, Post, Put, UseAfter, UseBefore} from "routing-controllers";
import NewPostDto from "../dto/NewPostDto";
import PostService from "../service/PostService";
import PostServiceImpl from "../service/PostServiceImpl";
import Comment from "../models/Comment";
import {CommentDto} from "../dto/CommentDto";
import {checkAuthorMiddleware} from "../middlware/checkAuthorMiddleware";
import {authMiddleware} from "../../accounting/middlware/authenticationMiddlware";
import {checkPostOwnerMiddleware} from "../middlware/checkPostOwnerMiddleware";
import {CustomErrorHandler} from "../middlware/CustomErrorHandler";

@Controller('/forum')
export default class PostController {
    postService:PostService = new PostServiceImpl();

    @Post("/post/:author")
    @UseBefore(authMiddleware, checkAuthorMiddleware)
    async createPost(@Param('author') author:string, @Body() newPostDto: NewPostDto){
        return await this.postService.createPost(author,newPostDto.title , newPostDto.content, newPostDto.tags);
    }

    @Get("/post/:id")
    @UseBefore(authMiddleware)
    async findPostById(@Param('id') id:string){
        return await this.postService.findPostById(id);
    }

    @Put("/post/:id")
    @UseBefore(authMiddleware, checkPostOwnerMiddleware)
    async updatePost(@Param('id') id:string, @Body() updatePostDto: Partial<NewPostDto>){
        return await this.postService.updatePost(id, updatePostDto.title, updatePostDto.content, updatePostDto.tags);
    }

    @Delete("/post/:id")
    @UseBefore(authMiddleware, checkPostOwnerMiddleware)
    async deletePost(@Param('id') id: string){
        return await this.postService.deletePost(id);
    }

    @Get("/posts/author/:author")
    async findPostsByAuthor(@Param('author') author:string){
        return await this.postService.findPostsByAuthor(author);
    }

    @Post("/posts/tags")
    async findPostsByTags(@Body() tags:string[]){
        return await this.postService.findPostsByTags(new Set(tags));
    }

    @Post("/posts/period")
    async findPostsByPeriod( @Body() date: { "dateFrom": string, "dateTo": string } ) {
        return await this.postService.findPostsByPeriod(new Date(date.dateFrom), new Date(date.dateTo));
    }

    @Put("/post/:postId/comment/:author")
    @UseBefore(authMiddleware, checkAuthorMiddleware)
    async addComment(@Param('postId') postId: string, @Param('author') author: string,  @Body() comment: CommentDto ) {
        return await this.postService.addComment(postId, author, comment.message);
    }

    @Put("/post/:postId/like")
    @UseBefore(authMiddleware)
    async addLike(@Param('postId') postId: string ) {
        return await this.postService.addLike(postId);
    }

    @Get("/posts")
    async getPosts(){
        return await this.postService.getPosts();
    }
}