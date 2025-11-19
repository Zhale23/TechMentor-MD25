import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: any;
  let jwtService: Partial<JwtService>;

  const userMock = {
    id: 1,
    name: 'Jefferson',
    email: 'jp@gmail.com',
    password: 'password123',
    role: 'admin',
  } as any;

  beforeEach(() => {
    userRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('fake_token'),
    } as any;
    service = new AuthService(userRepo as any, jwtService as any);
  });

  afterEach(() => jest.resetAllMocks());

  it('should register a user', async () => {
    const dto = {
      name: 'Jeff',
      email: 'test@gmail.com',
      password: '123456',
    } as any;
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    userRepo.create.mockReturnValue({ ...dto, password: 'hashedPassword' });
    userRepo.save.mockResolvedValue({
      id: 1,
      ...dto,
      password: 'hashedPassword',
    });

    const res = await service.register(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(userRepo.create).toHaveBeenCalled();
    expect(userRepo.save).toHaveBeenCalled();
    expect(res).toEqual({
      message: 'Usuario registrado con exito',
      user: { id: undefined, email: dto.email },
    });
  });

  it('should login and return token', async () => {
    const data = { email: 'jp@gmail.com', password: 'password123' } as any;
    userRepo.findOne.mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await service.login(data);

    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { email: data.email },
    });
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(res).toEqual({ accessToken: 'fake_token' });
  });

  it('should throw if email not found', async () => {
    const data = { email: 'jp@gmail.com', password: 'password123' } as any;
    userRepo.findOne.mockResolvedValue(null);
    await expect(service.login(data)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if password invalid', async () => {
    const data = { email: 'jp@gmail.com', password: 'password123' } as any;
    userRepo.findOne.mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(service.login(data)).rejects.toThrow(UnauthorizedException);
  });
});
