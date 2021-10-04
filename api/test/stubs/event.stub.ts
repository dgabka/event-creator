import { Event } from '../../src/events/schemas/event.schema';

export const eventStub = (userId): Event => ({
  firstName: 'Dawid',
  lastName: 'Gabka',
  email: 'test@example.com',
  date: new Date(),
  user: userId,
});

export const createEventDto = () => ({
  firstName: 'Dawid',
  lastName: 'Gabka',
  email: 'test@example.com',
  date: new Date(),
});
