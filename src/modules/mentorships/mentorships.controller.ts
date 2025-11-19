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
import { MentorshipsService } from './mentorships.service';
import { CreateMentorshipDto } from '../../dto/create-mentorship.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MentorshipResponseDto } from '../../dto/mentorship-response.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Mentorships')
@Controller('mentorships')
export class MentorshipsController {
  constructor(private readonly service: MentorshipsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar mentorías (datos en memoria)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de mentorías',
    type: [MentorshipResponseDto],
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener mentoría por id' })
  @ApiResponse({
    status: 200,
    description: 'Mentoría encontrada',
    type: MentorshipResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mentora', 'admin')
  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Crear una mentoría (in-memory, para pruebas)' })
  @ApiResponse({
    status: 201,
    description: 'Mentoría creada',
    type: MentorshipResponseDto,
  })
  create(@Request() req, @Body() dto: CreateMentorshipDto) {
    // Only 'mentora' or 'admin' can create; mentors can only create their own mentorías
    const user = req.user;
    if (!user) throw new ForbiddenException('No autenticado');
    if (user.role !== 'admin' && user.role !== 'mentora') {
      throw new ForbiddenException('No tienes permiso para crear mentorías');
    }
    // If the logged user is a mentor, force the mentor_id to the logged user's id
    if (user.role === 'mentora') {
      dto.mentor_id = user.id;
    }

    // Admins may provide any mentor_id; mentors will always create on their own behalf
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mentora', 'admin')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Actualizar una mentoría (in-memory)' })
  @ApiResponse({
    status: 200,
    description: 'Mentoría actualizada',
    type: MentorshipResponseDto,
  })
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateMentorshipDto>,
  ) {
    const user = req.user;
    if (!user) throw new ForbiddenException('No autenticado');
    const m = await this.service.findOne(id);
    if (user.role !== 'admin' && user.role !== 'mentora') {
      throw new ForbiddenException(
        'No tienes permiso para actualizar mentorías',
      );
    }
    if (user.role === 'mentora' && user.id !== m.mentor_id) {
      throw new ForbiddenException(
        'No puedes actualizar mentorías de otra mentora',
      );
    }
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mentora', 'admin')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Eliminar una mentoría (in-memory)' })
  @ApiResponse({ status: 200, description: 'Mentoría eliminada' })
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const user = req.user;
    if (!user) throw new ForbiddenException('No autenticado');
    const m = this.service.findOne(id);
    if (user.role !== 'admin' && user.role !== 'mentora') {
      throw new ForbiddenException('No tienes permiso para eliminar mentorías');
    }
    // if service.findOne is async it returns a Promise; ensure we await it
    const resolved = await m;
    if (user.role === 'mentora' && user.id !== resolved.mentor_id) {
      throw new ForbiddenException(
        'No puedes eliminar mentorías de otra mentora',
      );
    }
    return this.service.remove(id);
  }
}
