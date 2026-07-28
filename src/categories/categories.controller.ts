import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Returns all active categories' })
  async getAll() {
    const categories = await this.categoriesService.findAll();
    return categories;
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Returns the category' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  async getById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'Category already exists' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category (soft delete)' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
