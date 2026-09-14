import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../auth/decorator/current-user.decorator.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
import { RegistrationsService } from './registrations.service.js';

type CurrentUserData = {
    id: number;
};

@Controller('registrations')
@UseGuards(AuthGuard('jwt'))
export class RegistrationsController {
    constructor(
        private readonly registrationsService: RegistrationsService,
    ) {}

    @Post()
    create(
        @CurrentUser()
        user: CurrentUserData,
        @Body()
        createRegistrationDto: CreateRegistrationDto,
    ) {
        return this.registrationsService.create(
            user.id,
            createRegistrationDto,
        );
    }

    @Get('my')
    findMyRegistrations(
        @CurrentUser()
        user: CurrentUserData,
    ) {
        return this.registrationsService.findMyRegistrations(
            user.id,
        );
    }

    @Get('event/:eventId')
    findMyRegistrationForEvent(
        @CurrentUser()
        user: CurrentUserData,
        @Param(
            'eventId',
            ParseIntPipe,
        )
        eventId: number,
    ) {
        return this.registrationsService.findMyRegistrationForEvent(
            user.id,
            eventId,
        );
    }

    @Delete(':id')
    remove(
        @CurrentUser()
        user: CurrentUserData,
        @Param(
            'id',
            ParseIntPipe,
        )
        registrationId: number,
    ) {
        return this.registrationsService.remove(
            user.id,
            registrationId,
        );
    }
}