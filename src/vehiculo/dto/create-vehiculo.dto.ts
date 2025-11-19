import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateVehiculoDto {
    usuario_id: number;

    @IsNotEmpty()
    @IsString()
    modelo: string;

    @IsString()
    @IsNotEmpty()
    matricula: string;

    @IsNotEmpty()
    anio: number;

    @IsNotEmpty()
    tipo_vehiculo: number;

    @IsNotEmpty()
    precio: number;

    @IsNumber()
    @IsNotEmpty()
    capacidad: number;

    @IsNotEmpty()
    estado_actual?: number;

    @IsNotEmpty()
    estado_vehiculo?: number;
}
