import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Education System Protest',
  })
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(50, { message: 'Name must be less than 50 characters' })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'education-system-protest',
  })
  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @MinLength(3)
  @MaxLength(50)
  slug: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Protests related to education system and student rights',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({
    description: 'Emoji icon',
    example: '🎓',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Color code',
    example: '#3498DB',
  })
  @IsOptional()
  @IsString()
  color?: string;
}
