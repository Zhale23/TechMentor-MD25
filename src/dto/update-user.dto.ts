import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";
import { Roles } from 'src/entities/user.entity';

export class UpdateUserDTO {
    @ApiPropertyOptional({ example: 'Jefferson Pulido', description: 'Nombre completo del usuario' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'jp@gmail.com', description: 'Email valido del usuario' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: '123456', description: 'Contraseña minima de 6 caracteres' })
    @IsOptional()
    @Length(6, 100, { message: "La contraseña debe tener una longitud de minimo 6 caracteres" })
    password?: string;

    @ApiPropertyOptional({ example: 'mentora', description: 'Rol del usuario', required: false })
    @IsOptional()
    @IsString()
    role?: Roles;
}
