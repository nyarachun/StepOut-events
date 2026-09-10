import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Category } from './entities/category.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ) {
    const existingCategory =
      await this.categoryRepository.findOne({
        where: {
          name: createCategoryDto.name,
        },
      });

    if (existingCategory) {
      throw new ConflictException(
        'Category with this name already exists',
      );
    }

    const category =
      this.categoryRepository.create(
        createCategoryDto,
      );

    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.categoryRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const category =
      await this.categoryRepository.findOne({
        where: {
          id,
        },
      });

    if (!category) {
      throw new NotFoundException(
        `Category with id ${id} not found`,
      );
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name) {
      const existingCategory =
        await this.categoryRepository.findOne({
          where: {
            name: updateCategoryDto.name,
          },
        });

      if (
        existingCategory &&
        existingCategory.id !== id
      ) {
        throw new ConflictException(
          'Category with this name already exists',
        );
      }
    }

    Object.assign(
      category,
      updateCategoryDto,
    );

    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    await this.categoryRepository.remove(category);

    return {
      message: 'Category deleted successfully',
    };
  }
}