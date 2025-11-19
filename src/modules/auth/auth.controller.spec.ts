import { AuthController } from './auth.controller';

describe('AuthController (unit)', () => {
  let controller: AuthController;
  const mockAuthService: any = {
    register: jest
      .fn()
      .mockResolvedValue({ message: 'ok', user: { id: 1, email: 'a@b.com' } }),
    login: jest.fn().mockResolvedValue({ accessToken: 'tok' }),
  };

  beforeEach(() => {
    controller = new AuthController(mockAuthService);
  });

  it('should register a user', async () => {
    const dto: any = {
      name: 'A',
      email: 'a@b.com',
      password: 'p',
      role: 'aprendiz',
    };
    const res = await controller.register(dto);
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    expect(res).toHaveProperty('message');
  });

  it('should login a user', async () => {
    const dto: any = { email: 'a@b.com', password: 'p' };
    const res = await controller.login(dto);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    expect(res).toHaveProperty('accessToken');
  });

  it('getProfile should return req.user', () => {
    const fakeReq: any = { user: { id: 1, email: 'a@b.com' } };
    const res = controller.getProfile(fakeReq);
    expect(res).toBe(fakeReq.user);
  });
});
