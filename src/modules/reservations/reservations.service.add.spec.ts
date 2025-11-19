import { ReservationsService } from './reservations.service';
import { NotFoundException } from '@nestjs/common';

describe('ReservationsService additional', () => {
  let service: ReservationsService;
  const mockRepo: any = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((v) => v),
    save: jest.fn().mockImplementation((v) => Promise.resolve({ ...v, id: 1 })),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockUsersService: any = {
    findOne: jest.fn(),
  };

  beforeEach(() => {
    service = new ReservationsService(
      mockRepo as unknown as any,
      mockUsersService as any,
    );
    jest.clearAllMocks();
  });

  it('create should throw NotFoundException when apprentice not found', async () => {
    mockUsersService.findOne.mockResolvedValue(null);
    const dto: any = {
      apprentice_id: 999,
      mentorship_id: 1,
      date: new Date().toISOString(),
    };
    await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);
    expect(mockUsersService.findOne).toHaveBeenCalledWith(999);
  });

  it('create should save reservation when apprentice exists', async () => {
    mockUsersService.findOne.mockResolvedValue({ id: 2, name: 'A' });
    const dto: any = {
      apprentice_id: 2,
      mentorship_id: 1,
      date: new Date().toISOString(),
    };
    const res = await service.create(dto);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('id');
  });

  it('updateStatus should update and save', async () => {
    const r = { id: 7, status: 'pendiente' };
    mockRepo.findOne.mockResolvedValue(r);
    const res = await service.updateStatus(7, { status: 'confirmada' } as any);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 7 } });
    expect(mockRepo.save).toHaveBeenCalled();
    expect(res.status).toBe('confirmada');
  });

  it('remove should call findOne and repo.remove', async () => {
    const r = { id: 9 };
    mockRepo.findOne.mockResolvedValue(r);
    const res = await service.remove(9);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 9 } });
    expect(mockRepo.remove).toHaveBeenCalledWith(r);
    expect(res).toEqual({ deleted: true });
  });
});
