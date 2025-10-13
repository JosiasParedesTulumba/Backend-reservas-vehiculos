import { PartialType } from '@nestjs/mapped-types';
import { CreateVehiculoDto } from './create-vehiculo.dto';

export class UpdateVehiculoDto extends PartialType(CreateVehiculoDto) {
    modelo?: string;
    matricula?: string;
    anio?: number;
    tipo_vehiculo?: number;
    precio?: number;
    capacidad?: number;
    estado_actual?: number;
    estado_vehiculo?: number;
}
