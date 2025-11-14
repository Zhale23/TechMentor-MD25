import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export type ReservationStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  // We'll store the mentorship id (mentorships are in-memory for now)
  @Column({ type: 'int' })
  mentorship_id: number;

  @ManyToOne(() => User, { eager: true })
  apprentice: User;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'enum', enum: ['pendiente', 'confirmada', 'cancelada', 'completada'], default: 'pendiente' })
  status: ReservationStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
  apprentice_id: any;
}
