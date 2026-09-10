import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module.js';
import { RegistrationsModule } from './registrations/registrations.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { EventsModule } from './events/events.module.js';
import { UsersModule } from './users/users.module.js';
import { CitiesModule } from './cities/cities.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,

    CitiesModule,

    CategoriesModule,

    RegistrationsModule,

    FavoritesModule,

    EventsModule,

    AuthModule,
  ],
})
export class AppModule {}
