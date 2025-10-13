import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonaDto } from './create-persona.dto';

export class UpdatePersonaDto extends PartialType(CreatePersonaDto) {
    dni?: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
    puesto?: string;
    estado_persona?: number;

    // Para actualizar datos de usuario (si es empleado)
    nombre_usuario?: string;
    contrasena?: string;
    rol_id?: number;
    estado_usuario?: number;
}
