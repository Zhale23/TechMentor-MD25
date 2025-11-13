import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../../entities/reservation.entity';
import { CreateReservationDto } from '../../dto/create-reservation.dto';
import { UpdateReservationDto } from '../../dto/update-reservation.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepo.find();
  }

  async findOne(id: number): Promise<Reservation> {
    const r = await this.reservationRepo.findOne({ where: { id } });
    if (!r) throw new NotFoundException(`Reservation ${id} not found`);
    return r;
  }

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const user = await this.usersService.findOne(dto.apprentice_id);
    if (!user) throw new NotFoundException(`User ${dto.apprentice_id} not found`);

    const reservation = this.reservationRepo.create({
      mentorship_id: dto.mentorship_id,
      apprentice: user,
      date: new Date(dto.date),
      status: 'pendiente',
    });

    return this.reservationRepo.save(reservation);
  }

  async updateStatus(id: number, dto: UpdateReservationDto): Promise<Reservation> {
    const r = await this.findOne(id);
    r.status = dto.status;
    return this.reservationRepo.save(r);
  }

  async remove(id: number) {
    const r = await this.findOne(id);
    await this.reservationRepo.remove(r);
    return { deleted: true };
  }
}
