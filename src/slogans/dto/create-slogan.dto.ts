import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

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

  @ApiPropertyOptional({
    description: 'Category slug',
    example: 'education-system-protest',
    default: 'education-system-protest',
  })
  @IsOptional()
  @IsString()
  category?: string;
}