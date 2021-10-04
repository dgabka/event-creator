import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async find(user: User): Promise<Array<Event>> {
    return this.eventModel.find({ user }).exec();
  }

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    return this.eventModel.create({ ...createEventDto, user });
  }
}
