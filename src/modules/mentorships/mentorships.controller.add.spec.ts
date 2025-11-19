import { MentorshipsController } from './mentorships.controller';

describe('MentorshipsController extra', () => {
  const mockService: any = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ id: 1, mentor_id: 2 }),
    create: jest.fn().mockResolvedValue({ id: 2 }),
    update: jest.fn().mockResolvedValue({ id: 1 }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  let controller: MentorshipsController;

  beforeEach(() => {
    controller = new MentorshipsController(mockService);
  });

  it('findAll delegates to service', async () => {
    await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('create by mentora should force mentor_id', async () => {
    const dto: any = { title: 'T' };
    const req: any = { user: { id: 42, role: 'mentora' } };
    await controller.create(req, dto);
    expect(dto.mentor_id).toBe(42);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update throws if not allowed', async () => {
    const req: any = { user: { id: 99, role: 'aprendiz' } };
    await expect(controller.update(req, 1, {} as any)).rejects.toBeDefined();
  });

  it('remove throws if not allowed', async () => {
    const req: any = { user: { id: 99, role: 'aprendiz' } };
    await expect(controller.remove(req, 1)).rejects.toBeDefined();
  });
});
