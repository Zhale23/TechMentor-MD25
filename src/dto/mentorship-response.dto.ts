import { ApiProperty } from '@nestjs/swagger';

export class MentorshipResponseDto {
  @ApiProperty({ example: 10 })
  id: number;

  @ApiProperty({ example: 'Node.js Básico' })
  title: string;

  @ApiProperty({ example: 'Introducción a Node.js para principiantes' })
  description?: string;

  @ApiProperty({ example: 2, description: 'ID del mentor (users.id)' })
  mentor_id: number;

  @ApiProperty({ example: 5 })
  slots: number;

  @ApiProperty({ example: 0 })
  price?: number;

  @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
  updated_at: string;
}
