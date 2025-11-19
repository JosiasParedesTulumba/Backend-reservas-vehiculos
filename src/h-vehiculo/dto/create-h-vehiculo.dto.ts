import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateHVehiculoDto {

    @IsNumber()
    vehiculo_id: number;

    @IsDate()
    fecha_evento?: Date;

    @IsString()
    descripcion?: string;

    @IsString()
    tipo_evento: string;
}
