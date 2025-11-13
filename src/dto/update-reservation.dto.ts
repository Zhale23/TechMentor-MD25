import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto {
  @ApiProperty({ example: 'confirmada', enum: ['pendiente','confirmada','cancelada','completada'] })
  @IsIn(['pendiente','confirmada','cancelada','completada'])
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
}
