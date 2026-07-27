import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Slogan, SloganDocument } from './schemas/slogan.schema';
import { Model } from 'mongoose';
import { CreateSloganDto } from './dto/create-slogan.dto';

@Injectable()
export class SlogansService {
  constructor(
    @InjectModel(Slogan.name) private sloganModel: Model<SloganDocument>,
  ) {
    console.log('Slogans service is reday');
  }

  async create(createSloganDto: CreateSloganDto, userId: string) {
    const slogan = new this.sloganModel({
      text: createSloganDto.text,
      author: userId,
      category: createSloganDto.category || 'education-system-protest',
    });

    await slogan.save();
    return slogan;
  }

  async getTrending(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [slogans, total] = await Promise.all([
      this.sloganModel
        .find({ isActive: true })
        .sort({ trendingScore: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar')
        .exec(),

      this.sloganModel.countDocuments({ isActive: true }),
    ]);

    return {
      data: slogans,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: string) {
    const slogan = await this.sloganModel
      .findById(id)
      .populate('author', 'name avatar')
      .exec();

    if (!slogan) {
      throw new NotFoundException('Slogan not found');
    }

    return slogan; // Just return data
  }

  async toggleLike(sloganId: string, userId: string) {
    const slogan = await this.sloganModel.findById(sloganId);

    if (!slogan) {
      throw new NotFoundException('slogan not found');
    }

    const alreadyLiked = slogan.likes.includes(userId as any);

    if (alreadyLiked) {
      slogan.likes = slogan.likes.filter((id) => id.toString() !== userId);
      slogan.likeCount = Math.max(0, slogan.likeCount - 1);
    } else {
      slogan.likes.push(userId as any);
      slogan.likeCount++;
    }

    slogan.trendingScore = this.calculateScore(slogan);
    await slogan.save()

    return {
        liked: !alreadyLiked,
        likeCount: slogan.likeCount,
    }
  }

  async getUserSlogans(userId: string) {
    const slogans = await this.sloganModel
      .find({ author: userId as any, isActive: true })
      .sort({createdAt: -1})
      .populate('author', 'name avatar')
      .exec();
    
    return slogans;
  }

  async delete(sloganId: string, userId: string) {
    const slogan = await this.sloganModel.findOne({
        _id: sloganId as any,
        author: userId as any
    })

    if(!slogan) {
        throw new NotFoundException('slogans not found or unauthorized');
    }

    slogan.isActive = false;
    await slogan.save();
    return {message: 'slogan deleted successfully'}
  }

  private calculateScore(slogan: SloganDocument): number {
    const now = new Date();
    const created = new Date(slogan.createdAt);
    const hours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

    const boost = hours < 24 ? 100 : 0;
    const decay = Math.max(1, Math.log(hours + 1));
    const score = (slogan.likeCount * 2 + boost) / decay;

    return Math.round(score * 100) / 100;
  }
}
