import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ForbiddenException,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { UpdateUserDTO } from '../../dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserResponseDTO } from '../../dto/user-response.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario (administración)' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado',
    type: UserResponseDTO,
  })
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios (administración)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: [UserResponseDTO],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por id (administración)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UserResponseDTO,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por id (administración)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado',
    type: UserResponseDTO,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por id (administración)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = req.user;
    if (user && user.id === id) {
      throw new ForbiddenException('No puedes eliminar tu propio usuario');
    }
    return this.usersService.remove(id);
  }
}
