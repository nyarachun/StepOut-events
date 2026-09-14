import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../auth/decorator/current-user.decorator.js';

import { CreateSquadDto } from './dto/create-squad.dto.js';
import { SquadsService } from './squads.service.js';
type CurrentUserData = {
    id: number;
};

@Controller('squads')
@UseGuards(AuthGuard('jwt'))
export class SquadsController {
    constructor(
        private readonly squadsService: SquadsService,
    ) {}

    @Post()
    createOrJoin(
        @CurrentUser()
        user: CurrentUserData,
        @Body()
        createSquadDto: CreateSquadDto,
    ) {
        return this.squadsService.createOrJoin(
            user.id,
            createSquadDto,
        );
    }

    @Get('my')
    findMySquads(
        @CurrentUser()
        user: CurrentUserData,
    ) {
        return this.squadsService.findMySquads(
            user.id,
        );
    }
}