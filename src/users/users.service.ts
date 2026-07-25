import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    console.log('✅ Users Service is ready');
  }

  // Find user by Google ID
  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    console.log(`🔍 Finding user by Google ID`);
    return this.userModel.findOne({ googleId });  // ← THIS METHOD
  }

  // Find user by MongoDB ID
  async findById(id: string): Promise<UserDocument | null> {
    console.log(`🔍 Finding user by ID`);
    return this.userModel.findById(id);
  }

  // Find user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    console.log(`🔍 Finding user by email`);
    return this.userModel.findOne({ email });
  }

  // Create new user
  async create(data: {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
  }): Promise<UserDocument> {
    console.log(`📝 Creating new user: ${data.email}`);
    
    const user = new this.userModel({
      ...data,
      lastLogin: new Date(),
    });
    
    return user.save();
  }

  // Update last login time
  async updateLastLogin(userId: string): Promise<void> {
    console.log(`🕐 Updating last login`);
    await this.userModel.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }
}