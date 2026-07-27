import { Controller, Get, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  
  constructor(private usersService: UsersService) {
    console.log('✅ Users Controller is ready');
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  async getProfile(@Req() req) {
    const user = await this.usersService.findById(req.user.userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return {
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        slogansCreated: user.slogansCreated,
      }
    };
  }
}