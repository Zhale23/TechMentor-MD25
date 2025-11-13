import { IsInt, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 10, description: 'ID de la mentoría (FK hacia los datos en memoria)' })
  @IsInt()
  mentorship_id: number;

  @ApiProperty({ example: 3, description: 'ID del aprendiz (users.id)' })
  @IsInt()
  apprentice_id: number;

  @ApiProperty({ example: '2025-12-01T15:00:00.000Z', description: 'Fecha y hora ISO de la reserva' })
  @IsISO8601()
  date: string;
}
