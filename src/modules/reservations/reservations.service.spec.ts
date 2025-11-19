import { NotFoundException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepo: any;
  let usersService: any;

  beforeEach(() => {
    reservationRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    usersService = { findOne: jest.fn() };

    service = new ReservationsService(
      reservationRepo as any,
      usersService as any,
    );
  });

  it('should create a reservation when apprentice exists', async () => {
    const dto: any = {
      mentorship_id: 1,
      apprentice_id: 2,
      date: new Date().toISOString(),
    };
    const user = { id: 2 } as any;
    usersService.findOne.mockResolvedValue(user);
    reservationRepo.create.mockImplementation((v) => v);
    reservationRepo.save.mockResolvedValue({ id: 5, ...dto } as any);

    const res = await service.create(dto);
    expect(usersService.findOne).toHaveBeenCalledWith(2);
    expect(reservationRepo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('id', 5);
  });

  it('should throw if apprentice not found', async () => {
    const dto: any = {
      mentorship_id: 1,
      apprentice_id: 99,
      date: new Date().toISOString(),
    };
    usersService.findOne.mockResolvedValue(null);
    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException for findOne missing', async () => {
    reservationRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
  });
});
