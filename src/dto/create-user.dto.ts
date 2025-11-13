import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Roles } from 'src/entities/user.entity';

export class CreateUserDTO {
    @ApiProperty({ example: 'Jefferson Pulido', description: 'Nombre completo del usuario' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'jp@gmail.com', description: 'Email valido del usuario' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', description: 'Contraseña minima de 6 caracteres' })
    @IsNotEmpty()
    @Length(6, 100, { message: "La contraseña debe tener una longitud de minimo 6 caracteres" })
    password: string;

    @ApiProperty({ example: 'mentora', description: 'Rol del usuario', required: false })
    @IsOptional()
    @IsString()
    role?: Roles;
}
