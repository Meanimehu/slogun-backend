import { Controller, Get, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  
  constructor(private usersService: UsersService) {
    console.log('✅ Users Controller is ready');
  }

  // GET /api/users/profile
  // Only logged-in users can access
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    console.log('👤 User requesting their profile');
    
    const user = await this.usersService.findById(req.user.userId);
    
    // Check if user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return {
      success: true,
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