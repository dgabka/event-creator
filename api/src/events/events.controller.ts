import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

@UseInterceptors(new SanitizeMongooseModelInterceptor())
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUsersEvents(@Request() req): Promise<Array<CreateEventDto>> {
    return this.eventService.find(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(@Request() req, @Body() body: CreateEventDto) {
    return this.eventService.create(body, req.user);
  }
}
