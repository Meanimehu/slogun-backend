import { 
  Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Req 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SlogansService } from './slogans.service';
import { CreateSloganDto } from './dto/create-slogan.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Slogans')  // Groups endpoints in Swagger
@Controller('slogans')
export class SlogansController {
  
  constructor(private slogansService: SlogansService) {}

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Get trending slogans' })
  @ApiResponse({ status: 200, description: 'Returns trending slogans with pagination' })
  getTrending(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.slogansService.getTrending(page, limit);
  }

  @Get('user/mine')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my slogans' })
  @ApiResponse({ status: 200, description: 'Returns user slogans' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMySlogans(@Req() req) {
    return this.slogansService.getUserSlogans(req.user.userId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get slogan by ID' })
  @ApiResponse({ status: 200, description: 'Returns a slogan' })
  @ApiResponse({ status: 404, description: 'Slogan not found' })
  getSlogan(@Param('id') id: string) {
    return this.slogansService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new slogan' })
  @ApiResponse({ status: 201, description: 'Slogan created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createSlogan(@Body() dto: CreateSloganDto, @Req() req) {
    return this.slogansService.create(dto, req.user.userId);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like or unlike a slogan' })
  @ApiResponse({ status: 200, description: 'Like toggled' })
  @ApiResponse({ status: 404, description: 'Slogan not found' })
  toggleLike(@Param('id') id: string, @Req() req) {
    return this.slogansService.toggleLike(id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a slogan' })
  @ApiResponse({ status: 200, description: 'Slogan deleted' })
  @ApiResponse({ status: 404, description: 'Slogan not found' })
  deleteSlogan(@Param('id') id: string, @Req() req) {
    return this.slogansService.delete(id, req.user.userId);
  }
}