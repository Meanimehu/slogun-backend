import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreateSloganDto {
  @ApiProperty({
    description: 'The slogan text',
    example: 'Education is a right, not a privilege!',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'Slogan text is required' })
  @MinLength(3, { message: 'Slogan must be at least 3 characters' })
  @MaxLength(200, { message: 'Slogan must be less than 200 characters' })
  text: string;

  @ApiProperty({
    description: 'Category ID (MongoDB ObjectId)',
    example: '64a1b2c3d4e5f6a7b8c9d0e1',
  })
  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  @IsMongoId({ message: 'Invalid category ID' })
  category: string;
}
