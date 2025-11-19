import { IsString } from "class-validator";

export class LoginDto {

    @IsString()
    nombre_usuario: string;

    @IsString()
    contrasena: string;
}
