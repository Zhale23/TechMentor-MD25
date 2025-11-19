import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { MentorshipsService } from '../mentorships/mentorships.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let reservationsService: jest.Mocked<ReservationsService>;
  let mentorshipsService: jest.Mocked<MentorshipsService>;

  beforeEach(() => {
    reservationsService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      remove: jest.fn(),
    } as any;

    mentorshipsService = { findAll: jest.fn(), findOne: jest.fn() } as any;

    controller = new ReservationsController(
      reservationsService as any,
      mentorshipsService as any,
    );
  });

  it('admin gets all reservations', async () => {
    const req = { user: { id: 1, role: 'admin' } } as any;
    reservationsService.findAll.mockResolvedValue([
      { id: 1 },
      { id: 2 },
    ] as any);
    const res = await controller.findAll(req);
    expect(reservationsService.findAll).toHaveBeenCalled();
    expect(res).toHaveLength(2);
  });

  it('aprendiz gets only own reservations', async () => {
    const req = { user: { id: 5, role: 'aprendiz' } } as any;
    reservationsService.findAll.mockResolvedValue([
      { id: 1, apprentice: { id: 5 } },
      { id: 2, apprentice: { id: 6 } },
    ] as any);

    const res = await controller.findAll(req);
    expect(res).toEqual(
      expect.arrayContaining([{ id: 1, apprentice: { id: 5 } }]),
    );
  });

  it('mentora gets only reservations for her mentorships', async () => {
    const req = { user: { id: 2, role: 'mentora' } } as any;
    reservationsService.findAll.mockResolvedValue([
      { id: 1, mentorship_id: 10 },
      { id: 2, mentorship_id: 11 },
    ] as any);
    mentorshipsService.findAll.mockResolvedValue([
      { id: 10, mentor_id: 2 },
      { id: 11, mentor_id: 99 },
    ] as any);

    const res = await controller.findAll(req);
    expect(res).toEqual(expect.arrayContaining([{ id: 1, mentorship_id: 10 }]));
  });
});
