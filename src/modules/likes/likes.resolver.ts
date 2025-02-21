import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { LikeDto } from '../../common/dto/like.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { UserLikesInput } from './dto/userLikes.dto.input';
import { GraphQLCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@UseGuards(JwtAuthGuard)
@Resolver(() => LikeDto)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => LikeDto)
  createLike(
    @Args({ name: 'likeInput' }) likeIput: UserLikesInput,
    @GetUser() user,
  ) {
    return this.likesService.createLike(
      user.id,
      likeIput.postId,
      likeIput.emoji,
    );
  }

  @Mutation(() => LikeDto)
  updateLikeEmoji(
    @Args({ name: 'likeInput' }) likesInput: UserLikesInput,
    @GetUser() user,
  ) {
    return this.likesService.updateLikeEmoji(
      user.id,
      likesInput.postId,
      likesInput.emoji,
    );
  }

  @Query(() => [LikeDto])
  @UseInterceptors(GraphQLCacheInterceptor)
  getLikesByPost(@Args({ name: 'postId', type: () => Int }) postId: number) {
    return this.likesService.getLikesByPost(postId);
  }

  @Query(() => [LikeDto])
  @UseInterceptors(GraphQLCacheInterceptor)
  getLikesByUser(@GetUser() user) {
    return this.likesService.getLikesByUser(user.id);
  }

  @Query(() => LikeDto)
  @UseInterceptors(GraphQLCacheInterceptor)
  getLikeById(@Args({ name: 'likeId', type: () => Int }) likeId: number) {
    return this.likesService.getLikeById(likeId);
  }

  @Mutation(() => LikeDto)
  deleteLike(
    @Args({ name: 'postId', type: () => Int }) postId: number,
    @GetUser() user,
  ) {
    return this.likesService.deleteLikeByUserAndPost(user.id, postId);
  }
}
