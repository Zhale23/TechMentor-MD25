import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMentorshipDto {
  @ApiProperty({ example: 'Node.js Básico', description: 'Título de la mentoría' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Introducción a Node.js para principiantes' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2, description: 'ID del mentor (users.id)' })
  @IsInt()
  mentor_id: number;

  @ApiPropertyOptional({ example: 5, description: 'Número de cupos disponibles' })
  @IsOptional()
  @IsInt()
  slots?: number;

  @ApiPropertyOptional({ example: 0, description: 'Precio en la moneda que uses' })
  @IsOptional()
  @IsNumber()
  price?: number;
}
