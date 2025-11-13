import { ApiProperty } from '@nestjs/swagger';

export class ReservationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 10, description: 'ID de la mentorship (datos en memoria)' })
  mentorship_id: number;

  @ApiProperty({ example: 3 })
  apprentice_id: number;

  @ApiProperty({ example: '2025-12-01T15:00:00.000Z' })
  date: string;

  @ApiProperty({ example: 'pendiente', enum: ['pendiente','confirmada','cancelada','completada'] })
  status: string;

  @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
  updated_at: string;
}
