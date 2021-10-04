import { User } from '../../src/users/schemas/user.schema';

export const userStub = (): User => ({
  firstName: 'Dawid',
  lastName: 'Gąbka',
  email: 'test@example.com',
  password: 'Test@135',
});
