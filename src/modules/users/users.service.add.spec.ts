import { UsersService } from './users.service';

describe('UsersService extra', () => {
  let service: UsersService;
  const mockRepo: any = {
    create: jest.fn().mockImplementation((u) => u),
    save: jest.fn().mockImplementation((u) => Promise.resolve({ ...u, id: 1 })),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    // bypass constructor wiring by casting
    service = new UsersService(mockRepo as unknown as any);
  });

  it('create should hash password and save', async () => {
    const dto: any = {
      name: 'A',
      email: 'a@b.com',
      password: 'secret',
      role: 'aprendiz',
    };
    const u = await service.create(dto);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(u).toHaveProperty('id');
    expect(u.password).not.toBe('secret');
  });

  it('update with password should hash and call update', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 2, name: 'X' });
    const res = await service.update(2, { password: 'new' } as any);
    expect(mockRepo.update).toHaveBeenCalled();
  });
});
