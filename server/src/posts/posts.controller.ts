import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from 'src/dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsServices: PostsService) { }

    @Get()
    findAll() {
        return this.postsServices.findAll()
    }

    @Post()
    create(@Body(ValidationPipe) createPostDto: CreatePostDto) {
        return this.postsServices.create(createPostDto)
    }

    @Delete(':postId')
    deleteOne(@Param('postId') postId: string) {
        return this.postsServices.deleteOne(postId)
    }

    @Put(':postId')
    updateOne(@Param('postId') postId: string, @Body(ValidationPipe) updatedPostDto: UpdatePostDto) {
        return this.postsServices.updateOne(postId, updatedPostDto)
    }

}
