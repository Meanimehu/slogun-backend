import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CategoryDocument = Category & Document;
@Schema({
    timestamps: true,
    collection: 'categories'
})

export class Category {
    @Prop({required: true, unique: true,trim: true})
    name: string;

    @Prop({required: true, unique: true, lowercase: true,trim: true})
    slug: string;

     @Prop({ required: true, maxlength: 500 })
  description: string;

  @Prop({ default: '📢' })
  icon: string;

  @Prop({ default: '#3498DB' })
  color: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: 0 })
  sloganCount: number;


}

export const CategorySchema = SchemaFactory.createForClass(Category)

CategorySchema.index({slug: 1})
CategorySchema.index({isActive: 1})