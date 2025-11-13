import { ApiProperty } from '@nestjs/swagger';

class RegisteredUser {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'jp@gmail.com' })
  email: string;
}

export class RegisterResponseDTO {
  @ApiProperty({ example: 'Usuario registrado con exito' })
  message: string;

  @ApiProperty({ type: RegisteredUser })
  user: RegisteredUser;
}
