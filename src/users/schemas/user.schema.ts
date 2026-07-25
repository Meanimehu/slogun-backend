import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Step 1: Create a TypeScript type
export type UserDocument = User & Document;

// Step 2: Define the Schema
@Schema({ 
  timestamps: true,        // Auto adds createdAt and updatedAt
  collection: 'users'      // MongoDB collection name
})
export class User {
  
  @Prop({ required: true, unique: true })
  googleId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar: string;

  @Prop({ default: [] })
  likedSlogans: string[];

  @Prop({ default: 0 })
  slogansCreated: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLogin: Date;
}

// Step 3: Create the actual Mongoose schema
export const UserSchema = SchemaFactory.createForClass(User);