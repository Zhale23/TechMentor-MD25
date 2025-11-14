import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../../entities/reservation.entity';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { UsersModule } from '../users/users.module';
import { MentorshipsModule } from '../mentorships/mentorships.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    UsersModule,
    MentorshipsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
