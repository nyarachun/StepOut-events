import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { City } from './entities/city.entity.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { UpdateCityDto } from './dto/update-city.dto.js';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const { name }: CreateCityDto = createCityDto;

    const existingCity = await this.cityRepository.findOneBy({
      name,
    });

    if (existingCity) {
      throw new ConflictException('City with this name already exists');
    }

    const city = this.cityRepository.create({
      name,
    });

    return this.cityRepository.save(city);
  }

  async findAll() {
    return this.cityRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const city = await this.cityRepository.findOneBy({
      id,
    });

    if (!city) {
      throw new NotFoundException(`City with id ${id} not found`);
    }

    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);

    const { name }: UpdateCityDto = updateCityDto;

    if (name !== undefined && name !== city.name) {
      const existingCity = await this.cityRepository.findOneBy({
        name,
      });

      if (existingCity) {
        throw new ConflictException('City with this name already exists');
      }

      city.name = name;
    }

    return this.cityRepository.save(city);
  }

  async remove(id: number) {
    const city = await this.findOne(id);

    await this.cityRepository.remove(city);
  }
}
