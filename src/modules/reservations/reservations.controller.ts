import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from '../../dto/create-reservation.dto';
import { UpdateReservationDto } from '../../dto/update-reservation.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReservationResponseDto } from '../../dto/reservation-response.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { MentorshipsService } from '../mentorships/mentorships.service';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly service: ReservationsService,
    private readonly mentorshipsService: MentorshipsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar reservas (persistentes en DB)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas',
    type: [ReservationResponseDto],
  })
  findAll(@Request() req) {
    const user = req.user;
    // If no auth provided, deny access to list (require JWT)
    if (!user) throw new ForbiddenException('No autenticado');
    // admin sees all
    if (user.role === 'admin') return this.service.findAll();
    // aprendiz: only their own
    if (user.role === 'aprendiz') {
      return this.service
        .findAll()
        .then((list) =>
          list.filter((r) => r.apprentice && r.apprentice.id === user.id),
        );
    }
    // mentora: see reservations for their mentorships
    if (user.role === 'mentora') {
      const myMentorships = this.mentorshipsService
        .findAll()
        .filter((m) => m.mentor_id === user.id)
        .map((m) => m.id);
      return this.service
        .findAll()
        .then((list) =>
          list.filter((r) => myMentorships.includes(r.mentorship_id)),
        );
    }
    // default: deny
    throw new ForbiddenException('No tienes permiso para ver estas reservas');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reserva por id' })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada',
    type: ReservationResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = req.user;
    if (!user) throw new ForbiddenException('No autenticado');
    const r = await this.service.findOne(id);
    if (user.role === 'admin') return r;
    if (user.role === 'aprendiz') {
      if (!r.apprentice || r.apprentice.id !== user.id)
        throw new ForbiddenException('No puedes ver esta reserva');
      return r;
    }
    if (user.role === 'mentora') {
      const m = this.mentorshipsService.findOne(r.mentorship_id);
      if (m.mentor_id !== user.id)
        throw new ForbiddenException('No puedes ver esta reserva');
      return r;
    }
    throw new ForbiddenException('No tienes permiso');
  }

  // Protect create: only 'aprendiz' (for themselves) or 'admin'
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('aprendiz', 'admin')
  @Post()
  @ApiOperation({ summary: 'Crear reserva (persistente en DB)' })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada',
    type: ReservationResponseDto,
  })
  create(@Request() req, @Body() dto: CreateReservationDto) {
    const user = req.user;
    if (user.role !== 'admin' && user.id !== dto.apprentice_id) {
      throw new ForbiddenException(
        'No puedes crear reservaciones para otro usuario',
      );
    }
    return this.service.create(dto);
  }

  // Protect updateStatus: only 'mentora' or 'admin'
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mentora', 'admin')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de la reserva' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
    type: ReservationResponseDto,
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.service.updateStatus(id, dto);
  }

  // Protect delete: only 'admin' or the apprentice owner
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'aprendiz')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reserva (DB)' })
  @ApiResponse({ status: 200, description: 'Reserva eliminada' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = req.user;
    const reservation = await this.service.findOne(id);
    if (user.role !== 'admin' && user.id !== reservation.apprentice_id) {
      throw new ForbiddenException('No puedes eliminar esta reserva');
    }
    return this.service.remove(id);
  }
}
