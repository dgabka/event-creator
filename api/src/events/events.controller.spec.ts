import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('EventsController', () => {
  let controller: EventsController;

  const mockEventService = {
    create: jest.fn((dto, user) => ({
      ...dto,
      user: user._id,
      _id: '123',
    })),
    find: jest.fn(() => [{ test: 'test' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService],
    })
      .overrideProvider(EventsService)
      .useValue(mockEventService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<EventsController>(EventsController);
  });

  describe('createEvent', () => {
    it('should create new event', async () => {
      const dto: CreateEventDto = {
        firstName: 'Dawid',
        lastName: 'Gabka',
        email: 'gabka.daw@gmail.com',
        date: '123',
      };

      const req = { user: { _id: '123' } };

      expect(await controller.createEvent(req, dto)).toMatchObject({
        ...dto,
        user: expect.any(String),
        _id: expect.any(String),
      });
      expect(mockEventService.create).toHaveBeenCalledWith(dto, req.user);
    });
  });

  describe('findUsersEvents', () => {
    it('should return list of users events', async () => {
      const req = { user: { _id: '123' } };
      expect(await controller.findUsersEvents(req)).toMatchObject([
        { test: 'test' },
      ]);
    });
  });
});
