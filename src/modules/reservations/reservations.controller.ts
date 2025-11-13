import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from '../../dto/create-reservation.dto';
import { UpdateReservationDto } from '../../dto/update-reservation.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationResponseDto } from '../../dto/reservation-response.dto';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar reservas (persistentes en DB)' })
  @ApiResponse({ status: 200, description: 'Lista de reservas', type: [ReservationResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reserva por id' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada', type: ReservationResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear reserva (persistente en DB)' })
  @ApiResponse({ status: 201, description: 'Reserva creada', type: ReservationResponseDto })
  create(@Body() dto: CreateReservationDto) {
    return this.service.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de la reserva' })
  @ApiResponse({ status: 200, description: 'Estado actualizado', type: ReservationResponseDto })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReservationDto) {
    return this.service.updateStatus(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reserva (DB)' })
  @ApiResponse({ status: 200, description: 'Reserva eliminada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
