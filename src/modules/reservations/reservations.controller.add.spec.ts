import { ReservationsController } from './reservations.controller';

describe('ReservationsController extra', () => {
  const sampleReservations = [
    { id: 1, apprentice: { id: 10 }, apprenticeship_id: 0, mentorship_id: 100 },
    { id: 2, apprentice: { id: 11 }, apprenticeship_id: 0, mentorship_id: 200 },
  ];

  const mockService: any = {
    findAll: jest.fn().mockResolvedValue(sampleReservations),
    findOne: jest.fn().mockResolvedValue(sampleReservations[0]),
    create: jest.fn().mockResolvedValue(sampleReservations[0]),
    updateStatus: jest.fn().mockResolvedValue(sampleReservations[0]),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  const mockMentorships: any = {
    findAll: jest.fn().mockResolvedValue([{ id: 100, mentor_id: 5 }]),
    findOne: jest.fn().mockResolvedValue({ id: 100, mentor_id: 5 }),
  };

  let controller: ReservationsController;

  beforeEach(() => {
    controller = new ReservationsController(mockService, mockMentorships);
  });

  it('findAll as aprendiz returns only own reservations', async () => {
    const req: any = { user: { id: 10, role: 'aprendiz' } };
    const res = await controller.findAll(req);
    expect(res).toEqual([sampleReservations[0]]);
  });

  it('findAll as mentora filters by mentorships', async () => {
    const req: any = { user: { id: 5, role: 'mentora' } };
    const res = await controller.findAll(req);
    // Only reservation with mentorship_id 100 should match
    expect(res).toEqual([sampleReservations[0]]);
  });

  it('create enforces apprentice ownership', async () => {
    const req: any = { user: { id: 10, role: 'aprendiz' } };
    const dto: any = {
      apprentice_id: 10,
      mentorship_id: 100,
      date: new Date().toISOString(),
    };
    const created = await controller.create(req, dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(created).toBeDefined();
  });
});
