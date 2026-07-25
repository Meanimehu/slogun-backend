import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true, collection: 'refresh_tokens' })
export class RefreshToken {
  
  @Prop({ required: true })
  token: string;

  @Prop({ 
    type: MongooseSchema.Types.ObjectId,  // ← Add type
    ref: 'User', 
    required: true 
  })
  userId: Types.ObjectId;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isRevoked: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.index({ token: 1 });
RefreshTokenSchema.index({ userId: 1 });