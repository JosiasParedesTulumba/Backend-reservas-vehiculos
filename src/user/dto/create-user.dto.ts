import { IsNumber, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    nombre_usuario: string;

    @IsString()
    contrasena: string;

    rol_id: number;

    @IsNumber()
    persona_id: number;
}
