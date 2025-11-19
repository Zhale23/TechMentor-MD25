import { MentorshipsService } from './mentorships.service';
import { NotFoundException } from '@nestjs/common';

describe('MentorshipsService additional', () => {
  let service: MentorshipsService;
  const mockRepo: any = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((v) => v),
    save: jest.fn().mockImplementation((v) => Promise.resolve({ ...v, id: 1 })),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    service = new MentorshipsService(mockRepo as unknown as any);
    jest.clearAllMocks();
  });

  it('findOne should throw NotFoundException when missing', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
  });

  it('create should use defaults for slots and price', async () => {
    const dto: any = { title: 'T', mentor_id: 3 };
    const res = await service.create(dto);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('id');
  });

  it('update should call findOne and save', async () => {
    const existing = { id: 5, title: 'old', mentor_id: 2 };
    mockRepo.findOne.mockResolvedValue(existing);
    const res = await service.update(5, { title: 'new' });
    expect(mockRepo.findOne).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('remove should call findOne then remove', async () => {
    const existing = { id: 8, title: 'x', mentor_id: 2 };
    mockRepo.findOne.mockResolvedValue(existing);
    const res = await service.remove(8);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 8 } });
    expect(mockRepo.remove).toHaveBeenCalledWith(existing);
    expect(res).toEqual({ deleted: true });
  });
});
