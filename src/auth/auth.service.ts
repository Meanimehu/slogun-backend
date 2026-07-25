import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {
    console.log('✅ Auth Service is ready');
  }

  async googleLogin(userFromGoogle: {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
  }) {
    console.log('\n🔐 === GOOGLE LOGIN ===');

    let user = await this.usersService.findByGoogleId(userFromGoogle.googleId);

    if (!user) {
      user = await this.usersService.create(userFromGoogle);
      console.log('   🆕 New user created');
    } else {
      await this.usersService.updateLastLogin(user._id.toString());
      console.log('   👋 Welcome back');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email);

    console.log('🔐 === LOGIN COMPLETE ===\n');

    return {
      success: true,
      ...tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  // Use string for userId
  // In generateTokens method, use 'new' keyword instead of create
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '30d' },
    );

    // Use new + save instead of create
    const tokenDoc = new this.refreshTokenModel({
      token: refreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await tokenDoc.save();

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(oldRefreshToken: string) {
    console.log('\n🔄 === REFRESHING TOKEN ===');

    const storedToken = await this.refreshTokenModel.findOne({
      token: oldRefreshToken,
      isRevoked: false,
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > storedToken.expiresAt) {
      await storedToken.deleteOne();
      throw new UnauthorizedException(
        'Refresh token expired, please login again',
      );
    }

    const user = await this.usersService.findById(
      storedToken.userId.toString(),
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await storedToken.deleteOne();

    const tokens = await this.generateTokens(user._id.toString(), user.email);

    console.log('✅ Tokens refreshed\n');

    return {
      success: true,
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenModel.findOneAndUpdate(
      { token: refreshToken },
      { isRevoked: true },
    );

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
