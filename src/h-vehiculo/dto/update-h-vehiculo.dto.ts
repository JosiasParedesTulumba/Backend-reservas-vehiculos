import { PartialType } from '@nestjs/mapped-types';
import { CreateHVehiculoDto } from './create-h-vehiculo.dto';

export class UpdateHVehiculoDto extends PartialType(CreateHVehiculoDto) {}
