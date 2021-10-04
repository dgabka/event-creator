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
import { Event } from './schemas/event.schema';

@UseInterceptors(
  new SanitizeMongooseModelInterceptor({
    excludeMongooseId: false,
    excludeMongooseV: true,
  }),
)
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUsersEvents(@Request() req): Promise<Array<Event>> {
    return this.eventService.find(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(@Request() req, @Body() body: CreateEventDto) {
    return this.eventService.create(body, req.user);
  }
}
