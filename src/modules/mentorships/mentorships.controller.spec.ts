import { MentorshipsController } from './mentorships.controller';
import { MentorshipsService } from './mentorships.service';
import { ForbiddenException } from '@nestjs/common';

describe('MentorshipsController', () => {
  let controller: MentorshipsController;
  let service: jest.Mocked<MentorshipsService>;

  const mentorships = [{ id: 1, title: 'A', mentor_id: 2 }];

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    controller = new MentorshipsController(service as any);
  });

  it('should list mentorships', async () => {
    service.findAll.mockResolvedValue(mentorships as any);
    const res = await controller.findAll();
    expect(res).toEqual(mentorships);
  });

  it('should return one mentorship', async () => {
    service.findOne.mockResolvedValue(mentorships[0] as any);
    const res = await controller.findOne(1 as any);
    expect(res).toEqual(mentorships[0]);
  });

  it('should forbid non-mentora/admin creating', () => {
    const req = { user: { id: 5, role: 'aprendiz' } } as any;
    const dto = { title: 'X' } as any;
    expect(() => controller.create(req, dto)).toThrow(ForbiddenException);
  });

  it('should allow mentora to create and force mentor_id', async () => {
    const req = { user: { id: 2, role: 'mentora' } } as any;
    const dto: any = { title: 'X', mentor_id: 999 };
    service.create.mockResolvedValue({
      id: 11,
      title: 'X',
      mentor_id: 2,
    } as any);
    const res = await controller.create(req, dto);
    expect(service.create).toHaveBeenCalled();
    expect(res).toHaveProperty('mentor_id', 2);
  });
});
