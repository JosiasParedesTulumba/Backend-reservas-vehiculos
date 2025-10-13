import { PartialType } from '@nestjs/mapped-types';
import { CreateRolDto } from './create-rol.dto';

export class UpdateRolDto extends PartialType(CreateRolDto) {
    nombre_rol?: string;
    estado_rol?: number;
}
