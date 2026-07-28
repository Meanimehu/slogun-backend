import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async findById(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlub(slug: string): Promise<CategoryDocument> {
    const category = await this.categoryModel
      .findOne({ slug: slug, isActive: true })
      .exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(data: CreateCategoryDto): Promise<CategoryDocument> {
    const existing = await this.categoryModel.findOne({ slug: data.slug });
    if (existing) {
      throw new ConflictException('Category with this slug already exists');
    }

    const category = new this.categoryModel({
      ...data,
      icon: data.icon || '📢',
      color: data.color || '#3498DB',
      sloganCount: 0,
    });

    return category.save();
  }

  async update(id: string, data: UpdateCategoryDto): Promise<CategoryDocument> {
    const category = await this.categoryModel.findByIdAndUpdate(id, data, {new: true}).exec()
    if(!category) {
        throw new NotFoundException('Category not found');
    }

    return category;
  }

  async remove(id: string):Promise<{message: string}> {
    const category = await this.categoryModel.findByIdAndUpdate(id, {isActive:false}, {new: true}).exec();
    if(!category) throw new NotFoundException('Category not Found')
    return {message: 'Category delte successfully'}
  } 

  async incrementSloganCount(id: string): Promise<void> {
    await this.categoryModel.findByIdAndUpdate(id, {
      $inc: { sloganCount: 1 },
    });
  }

   async decrementSloganCount(id: string): Promise<void> {
    await this.categoryModel.findByIdAndUpdate(id, {
      $inc: { sloganCount: -1 },
    });
  }
}
