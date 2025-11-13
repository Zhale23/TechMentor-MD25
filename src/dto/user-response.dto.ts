import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/entities/user.entity';

export class UserResponseDTO {
  @ApiProperty({ example: 1, description: 'Identificador único del usuario' })
  id: number;

  @ApiProperty({
    example: 'Jefferson Pulido',
    description: 'Nombre completo del usuario',
  })
  name: string;

  @ApiProperty({ example: 'jp@gmail.com', description: 'Email del usuario' })
  email: string;

  @ApiProperty({
    example: Roles.MENTORA,
    enum: [Roles.ADMIN, Roles.MENTORA, Roles.APRENDIZ],
    description: 'Rol del usuario',
  })
  role: Roles;
}
