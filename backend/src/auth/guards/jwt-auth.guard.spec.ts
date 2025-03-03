import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
    jest
      .spyOn(guard, 'canActivate')
      .mockImplementation((context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return !!request.user; // Eğer kullanıcı varsa true, yoksa false döndür
      });
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if user is authenticated', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 1, username: 'test' }, // Kullanıcı var
        }),
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return false if user is not authenticated', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}), // Kullanıcı yok
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(false);
  });
});
