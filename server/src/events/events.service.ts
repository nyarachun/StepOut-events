import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../users/entities/user.entity.js';
import { Event } from './entities/event.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { City } from '../cities/entities/city.entity.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { GetEventsDto } from './dto/get-events.dto.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(userId: number, createEventDto: CreateEventDto) {
    const { categoryId, cityId, date, ...eventData }: CreateEventDto =
      createEventDto;

    const organizer = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!organizer) {
      throw new NotFoundException(`Organizer with id ${userId} not found`);
    }

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    const city = await this.cityRepository.findOneBy({
      id: cityId,
    });

    if (!city) {
      throw new NotFoundException(`City with id ${cityId} not found`);
    }

    const event = this.eventRepository.create({
      ...eventData,
      date: new Date(date),
      organizer,
      category,
      city,
    });

    return this.eventRepository.save(event);
  }

  async findAll(getEventsDto: GetEventsDto) {
    const {
      cityId,
      categoryId,
      date,
      search,
      minPrice,
      maxPrice,
      sortBy = 'date',
      order = 'asc',
      page = 1,
      limit = 10,
    }: GetEventsDto = getEventsDto;

    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.city', 'city');

    if (cityId !== undefined) {
      query.andWhere('city.id = :cityId', {
        cityId,
      });
    }

    if (categoryId !== undefined) {
      query.andWhere('category.id = :categoryId', {
        categoryId,
      });
    }

    if (date !== undefined) {
      query.andWhere('DATE(event.date) = :date', {
        date,
      });
    }

    if (search !== undefined) {
      query.andWhere(
        '(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    if (minPrice !== undefined) {
      query.andWhere('event.price >= :minPrice', {
        minPrice,
      });
    }

    if (maxPrice !== undefined) {
      query.andWhere('event.price <= :maxPrice', {
        maxPrice,
      });
    }

    const sortColumns = {
      date: 'event.date',
      price: 'event.price',
      title: 'event.title',
    } as const;

    const sortColumn = sortColumns[String(sortBy) as keyof typeof sortColumns];

    query.orderBy(sortColumn, order.toUpperCase() as 'ASC' | 'DESC');

    const skip = (page - 1) * limit;

    query.skip(skip).take(limit);

    const [events, total] = await query.getManyAndCount();

    return {
      data: events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: {
        organizer: true,
        category: true,
        city: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return event;
  }

  async update(
    id: number,
    userId: number,
    userRole: UserRole,
    updateEventDto: UpdateEventDto,
  ) {
    const event = await this.findOne(id);

    if (userRole !== UserRole.ADMIN && event.organizer.id !== userId) {
      throw new ForbiddenException('You can only modify your own events');
    }

    const { categoryId, cityId, date, ...eventData }: UpdateEventDto =
      updateEventDto;

    Object.assign(event, eventData);

    if (date !== undefined) {
      event.date = new Date(date);
    }

    if (categoryId !== undefined) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });

      if (!category) {
        throw new NotFoundException(`Category with id ${categoryId} not found`);
      }

      event.category = category;
    }

    if (cityId !== undefined) {
      const city = await this.cityRepository.findOneBy({
        id: cityId,
      });

      if (!city) {
        throw new NotFoundException(`City with id ${cityId} not found`);
      }

      event.city = city;
    }

    return this.eventRepository.save(event);
  }

  async remove(id: number, userId: number, userRole: UserRole) {
    const event = await this.findOne(id);

    if (userRole !== UserRole.ADMIN && event.organizer.id !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.eventRepository.remove(event);
  }
}
