import { UserRoleMiddleware } from './user-role.middleware';

describe('UserRoleMiddleware', () => {
  it('should be defined', () => {
    expect(new UserRoleMiddleware()).toBeDefined();
  });
});
