import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity.js';
import { City } from '../cities/entities/city.entity.js';
import { Registration } from '../registrations/entities/registration.entity.js';
import { User, UserRole } from '../users/entities/user.entity.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { GetEventsDto } from './dto/get-events.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { Event } from './entities/event.entity.js';

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

    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
  ) {}

  async create(
    userId: number,
    userRole: string,
    createEventDto: CreateEventDto,
) {
    if (
        userRole !== 'organizer' &&
        userRole !== 'admin'
    ) {
        throw new ForbiddenException(
            'Only organizers can create events',
        );
    }

    const organizer =
        await this.userRepository.findOneBy({
            id: userId,
        });

    if (!organizer) {
        throw new NotFoundException(
            'Organizer not found',
        );
    }

    const category =
        await this.categoryRepository.findOneBy({
            id: createEventDto.categoryId,
        });

    if (!category) {
        throw new NotFoundException(
            'Category not found',
        );
    }

    const city =
        await this.cityRepository.findOneBy({
            id: createEventDto.cityId,
        });

    if (!city) {
        throw new NotFoundException(
            'City not found',
        );
    }

    const event =
        this.eventRepository.create({
            title: createEventDto.title,
            description:
                createEventDto.description,
            date: new Date(
                createEventDto.date,
            ),
            address:
                createEventDto.address,
            price: createEventDto.price,
            capacity:
                createEventDto.capacity,
            imageUrl:
                createEventDto.imageUrl,
            organizer,
            category,
            city,
        });

    return this.eventRepository.save(
        event,
    );
}

  async findAll(
    getEventsDto: GetEventsDto,
  ) {
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
      .leftJoinAndSelect(
        'event.organizer',
        'organizer',
      )
      .leftJoinAndSelect(
        'event.category',
        'category',
      )
      .leftJoinAndSelect(
        'event.city',
        'city',
      );

    if (cityId !== undefined) {
      query.andWhere(
        'city.id = :cityId',
        {
          cityId,
        },
      );
    }

    if (categoryId !== undefined) {
      query.andWhere(
        'category.id = :categoryId',
        {
          categoryId,
        },
      );
    }

    if (date !== undefined) {
      query.andWhere(
        'DATE(event.date) = :date',
        {
          date,
        },
      );
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
      query.andWhere(
        'event.price >= :minPrice',
        {
          minPrice,
        },
      );
    }

    if (maxPrice !== undefined) {
      query.andWhere(
        'event.price <= :maxPrice',
        {
          maxPrice,
        },
      );
    }

    const sortColumns = {
      date: 'event.date',
      price: 'event.price',
      title: 'event.title',
    } as const;

    const sortColumn =
      sortColumns[
        String(
          sortBy,
        ) as keyof typeof sortColumns
      ];

    query.orderBy(
      sortColumn,
      order.toUpperCase() as
        | 'ASC'
        | 'DESC',
    );

    const skip = (page - 1) * limit;

    query.skip(skip).take(limit);

    const [events, total] =
      await query.getManyAndCount();

    return {
      data: events,
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit,
      ),
    };
  }

  async findOne(id: number) {
    const event =
      await this.eventRepository.findOne({
        where: { id },
        relations: {
          organizer: true,
          category: true,
          city: true,
        },
      });

    if (!event) {
      throw new NotFoundException(
        `Event with id ${id} not found`,
      );
    }

    const registeredCount =
      await this.registrationRepository.count({
        where: {
          event: {
            id: event.id,
          },
        },
      });

    const availableSpots = Math.max(
      0,
      event.capacity -
        registeredCount,
    );

    return {
      ...event,
      registeredCount,
      availableSpots,
    };
  }

  async update(
    id: number,
    userId: number,
    userRole: UserRole,
    updateEventDto: UpdateEventDto,
  ) {
    const event =
      await this.findOne(id);

    if (
      userRole !== UserRole.ADMIN &&
      event.organizer.id !== userId
    ) {
      throw new ForbiddenException(
        'You can only modify your own events',
      );
    }

    const {
      categoryId,
      cityId,
      date,
      ...eventData
    }: UpdateEventDto =
      updateEventDto;

    Object.assign(
      event,
      eventData,
    );

    if (date !== undefined) {
      event.date = new Date(date);
    }

    if (categoryId !== undefined) {
      const category =
        await this.categoryRepository.findOneBy(
          {
            id: categoryId,
          },
        );

      if (!category) {
        throw new NotFoundException(
          `Category with id ${categoryId} not found`,
        );
      }

      event.category = category;
    }

    if (cityId !== undefined) {
      const city =
        await this.cityRepository.findOneBy(
          {
            id: cityId,
          },
        );

      if (!city) {
        throw new NotFoundException(
          `City with id ${cityId} not found`,
        );
      }

      event.city = city;
    }

    return this.eventRepository.save(
      event,
    );
  }

  async remove(
    id: number,
    userId: number,
    userRole: UserRole,
  ) {
    const event =
      await this.findOne(id);

    if (
      userRole !== UserRole.ADMIN &&
      event.organizer.id !== userId
    ) {
      throw new ForbiddenException(
        'You can only delete your own events',
      );
    }

    await this.eventRepository.remove(
      event,
    );
  }

  async findMyEvents(
    userId: number,
    userRole: string,
) {
    if (userRole === 'organizer') {
        return this.eventRepository.find({
            where: {
                organizer: {
                    id: userId,
                },
            },
            relations: {
                organizer: true,
                category: true,
                city: true,
            },
            order: {
                date: 'ASC',
            },
        });
    }

    const registrations =
        await this.registrationRepository.find({
            where: {
                user: {
                    id: userId,
                },
            },
            relations: {
                event: {
                    organizer: true,
                    category: true,
                    city: true,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });

    return registrations.map(
        (registration) =>
            registration.event,
    );
}

async updateForOrganizer(
    eventId: number,
    userId: number,
    userRole: string,
    updateEventDto: UpdateEventDto,
) {
    const event =
        await this.eventRepository.findOne({
            where: {
                id: eventId,
            },
            relations: {
                organizer: true,
            },
        });

    if (!event) {
        throw new NotFoundException(
            'Event not found',
        );
    }

    if (
        userRole !== 'admin' &&
        event.organizer.id !== userId
    ) {
        throw new ForbiddenException(
            'You can only edit your own events',
        );
    }

    if (
        updateEventDto.categoryId !==
        undefined
    ) {
        const category =
            await this.categoryRepository.findOneBy(
                {
                    id:
                        updateEventDto.categoryId,
                },
            );

        if (!category) {
            throw new NotFoundException(
                'Category not found',
            );
        }

        event.category = category;
    }

    if (
        updateEventDto.cityId !==
        undefined
    ) {
        const city =
            await this.cityRepository.findOneBy(
                {
                    id: updateEventDto.cityId,
                },
            );

        if (!city) {
            throw new NotFoundException(
                'City not found',
            );
        }

        event.city = city;
    }

    if (
        updateEventDto.title !==
        undefined
    ) {
        event.title =
            updateEventDto.title;
    }

    if (
        updateEventDto.description !==
        undefined
    ) {
        event.description =
            updateEventDto.description;
    }

    if (
        updateEventDto.date !==
        undefined
    ) {
        event.date = new Date(
            updateEventDto.date,
        );
    }

    if (
        updateEventDto.address !==
        undefined
    ) {
        event.address =
            updateEventDto.address;
    }

    if (
        updateEventDto.price !==
        undefined
    ) {
        event.price =
            updateEventDto.price;
    }

    if (
        updateEventDto.capacity !==
        undefined
    ) {
        event.capacity =
            updateEventDto.capacity;
    }

    if (
        updateEventDto.imageUrl !==
        undefined
    ) {
        event.imageUrl =
            updateEventDto.imageUrl;
    }

    return this.eventRepository.save(
        event,
    );
}

async removeForOrganizer(
    eventId: number,
    userId: number,
    userRole: string,
) {
    const event =
        await this.eventRepository.findOne({
            where: {
                id: eventId,
            },
            relations: {
                organizer: true,
            },
        });

    if (!event) {
        throw new NotFoundException(
            'Event not found',
        );
    }

    if (
        userRole !== 'admin' &&
        event.organizer.id !== userId
    ) {
        throw new ForbiddenException(
            'You can only delete your own events',
        );
    }

    await this.eventRepository.remove(
        event,
    );

    return {
        message:
            'Event deleted successfully',
    };
}
}