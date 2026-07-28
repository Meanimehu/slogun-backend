import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SloganDocument = Slogan & Document;

@Schema({ timestamps: true, collection: 'sloguns' })
export class Slogan {
  @Prop({ require: true, maxLength: 200 })
  text: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [
      { type: MongooseSchema.Types.ObjectId, ref: 'User', required: true },
    ],
  })
  likes: MongooseSchema.Types.ObjectId[];

  @Prop({ default: 0 })
  likeCount: number;
  @Prop({ default: 100 })
  trendingScore: number;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const SloganSchema = SchemaFactory.createForClass(Slogan);

SloganSchema.index({ trendingScore: -1 });
SloganSchema.index({ category: 1, trendingScore: -1 });
SloganSchema.index({ author: 1, createdAt: -1 });
