  import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common';
  import { MentorshipsService } from './mentorships.service';
  import { CreateMentorshipDto } from '../../dto/create-mentorship.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { MentorshipResponseDto } from '../../dto/mentorship-response.dto';

  @ApiTags('Mentorships')
  @Controller('mentorships')
  export class MentorshipsController {
    constructor(private readonly service: MentorshipsService) {}

    @Get()
    @ApiOperation({ summary: 'Listar mentorías (datos en memoria)' })
    @ApiResponse({ status: 200, description: 'Lista de mentorías', type: [MentorshipResponseDto] })
    findAll() {
      return this.service.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener mentoría por id' })
    @ApiResponse({ status: 200, description: 'Mentoría encontrada', type: MentorshipResponseDto })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.service.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear una mentoría (in-memory, para pruebas)' })
    @ApiResponse({ status: 201, description: 'Mentoría creada', type: MentorshipResponseDto })
    create(@Body() dto: CreateMentorshipDto) {
      return this.service.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una mentoría (in-memory)' })
    @ApiResponse({ status: 200, description: 'Mentoría actualizada', type: MentorshipResponseDto })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateMentorshipDto>) {
      return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una mentoría (in-memory)' })
    @ApiResponse({ status: 200, description: 'Mentoría eliminada' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
