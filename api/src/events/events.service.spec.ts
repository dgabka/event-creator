import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  const user = {
    _id: '123',
    firstName: 'Dawid',
    lastName: 'Gabka',
    email: 'gabka.daw@gmail.com',
    password: '123',
  };

  const mockModel = {
    create: jest.fn((event) => ({ ...event, user: event.user._id })),
    find: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken('Event'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save user', async () => {
      const dto: CreateEventDto = {
        firstName: 'Dawid',
        lastName: 'Gabka',
        email: 'gabka.daw@gmail.com',
        date: '123',
      };

      expect(await service.create(dto, user)).toMatchObject({
        ...dto,
        user: user._id,
      });
    });
  });

  describe('find', () => {
    it('should find events of user', async () => {
      jest.spyOn(mockModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([{}]),
      } as any);
      expect(await service.find(user)).toMatchObject([{}]);
    });
  });
});
