import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';
import { User } from '../../users/schemas/user.schema';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: Date,
    required: true,
  })
  date: Date;

  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @ExcludeProperty()
  user: User;
}

export const EventSchema = SchemaFactory.createForClass(Event);
