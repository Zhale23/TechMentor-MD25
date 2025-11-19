import { NotFoundException } from '@nestjs/common';
import { MentorshipsService } from './mentorships.service';

describe('MentorshipsService', () => {
  let service: MentorshipsService;
  let fakeRepo: any;

  beforeEach(() => {
    fakeRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    service = new MentorshipsService(fakeRepo as any);
  });

  it('should return all mentorships', async () => {
    fakeRepo.find.mockResolvedValue([{ id: 1 }]);
    const res = await service.findAll();
    expect(fakeRepo.find).toHaveBeenCalled();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('should throw NotFoundException when not found', async () => {
    fakeRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    expect(fakeRepo.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
  });

  it('should create and save mentorship', async () => {
    const dto = { title: 'T', mentor_id: 2 } as any;
    fakeRepo.create.mockReturnValue(dto);
    fakeRepo.save.mockResolvedValue({ id: 10, ...dto });

    const res = await service.create(dto);
    expect(fakeRepo.create).toHaveBeenCalled();
    expect(fakeRepo.save).toHaveBeenCalled();
    expect(res).toEqual({ id: 10, ...dto });
  });
});
