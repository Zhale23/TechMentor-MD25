import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const usersFake = [
    { id: 1, name: 'Jefferson', email: 'jp@gmail.com', role: 'admin' },
    { id: 2, name: 'Pulido', email: 'pulido@gmail.com', role: 'admin' },
  ];

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    controller = new UsersController(service);
  });

  it('should return all users', async () => {
    service.findAll.mockResolvedValue(usersFake as any);
    const res = await controller.findAll();
    expect(res).toEqual(usersFake);
  });

  it('should return a user by id', async () => {
    service.findOne.mockResolvedValue(usersFake[0] as any);
    const res = await controller.findOne(1);
    expect(res).not.toBeNull();
    expect((res as any).email).toEqual('jp@gmail.com');
  });

  it('should create a user', async () => {
    const newUser = {
      name: 'Carlos',
      email: 'carlito@gmail.com',
      password: '1234',
      role: 'aprendiz',
    } as any;
    service.create.mockResolvedValue({ id: 3, ...newUser } as any);
    const res = await controller.create(newUser);
    expect(service.create).toHaveBeenCalledWith(newUser);
    expect(res.id).toBe(3);
  });

  it('should update a user', async () => {
    const updated = { id: 1, name: 'Jefferson Dev', role: 'admin' } as any;
    service.update.mockResolvedValue(updated);
    const res = await controller.update(1, { name: 'Jefferson Dev' } as any);
    expect(service.update).toHaveBeenCalledWith(1, { name: 'Jefferson Dev' });
    expect(res).not.toBeNull();
    expect((res as any).name).toEqual('Jefferson Dev');
  });

  it('should not allow deleting yourself', () => {
    const req = { user: { id: 2 } } as any;
    expect(() => controller.remove(2, req)).toThrow(ForbiddenException);
  });

  it('should forward remove to service', async () => {
    const req = { user: { id: 1 } } as any;
    service.remove.mockResolvedValue({ message: 'ok' } as any);
    const res = await controller.remove(2, req);
    expect(service.remove).toHaveBeenCalledWith(2);
    expect(res).toEqual({ message: 'ok' });
  });
});
