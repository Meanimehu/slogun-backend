import { Controller, Get, Post, Body, UseGuards, Req, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    console.log('✅ Auth Controller is ready');
  }

  // Google Login
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('🔄 Redirecting to Google...');
  }

  // Google Callback
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Redirect()
  async googleAuthRedirect(@Req() req) {
    console.log('🔄 Google callback received!');
    
    try {
      const result = await this.authService.googleLogin(req.user);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      
      return {
        url: `${frontendUrl}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`,
        statusCode: 302,
      };
    } catch (error) {
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      return {
        url: `${frontendUrl}/auth/error?message=Login failed`,
        statusCode: 302,
      };
    }
  }

  // Refresh Token
  @Public()
  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  // Logout
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  // Get Profile
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return {
      success: true,
      user: req.user,
    };
  }
}