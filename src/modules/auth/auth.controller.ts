import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/dto/login.dto';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { JwtAuthGuard } from './jwt.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginResponseDTO } from 'src/dto/login-response.dto';
import { RegisterResponseDTO } from 'src/dto/register-response.dto';
import { UserResponseDTO } from 'src/dto/user-response.dto';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra un usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado con exito en BD',
    type: RegisterResponseDTO,
  })
  register(@Body() data: CreateUserDTO) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicia la sesion de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario logueado con exito y devuelve el JWT Token',
    type: LoginResponseDTO,
  })
  @ApiResponse({ status: 401, description: 'Credenciales invalidas' })
  login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }

  // @Post('logout')
  // @UseGuards(JwtAuthGuard)
  // logout(@Request() req) {
  //     const token = req.headers.authorization?.split(' ')[1]
  //     return this.authService.logout(token);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Devuelve la informacion del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Informacion del usuario',
    type: UserResponseDTO,
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
