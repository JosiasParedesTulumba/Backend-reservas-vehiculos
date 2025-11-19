import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReservaDto {
    @IsNumber()
    @IsNotEmpty()
    vehiculo_id: number;

    @IsNumber()
    @IsNotEmpty()
    persona_id: number;

    @IsDateString()
    @IsNotEmpty()
    fecha_inicio: Date;

    @IsDateString()
    @IsNotEmpty()
    fecha_fin: Date;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNumber()
    @IsOptional()
    estado_reserva?: number;
}
