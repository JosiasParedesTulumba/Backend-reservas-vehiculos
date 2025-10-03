import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    nombre_usuario?: string;
    contrasena?: string;
    rol_id?: number;
    estado_usuario?: number;
}
