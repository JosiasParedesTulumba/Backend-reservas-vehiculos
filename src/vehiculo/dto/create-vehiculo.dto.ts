export class CreateVehiculoDto {
    usuario_id: number;
    modelo: string;
    matricula: string;
    anio: number;
    tipo_vehiculo: number;
    precio: number;
    capacidad: number;
    estado_actual?: number;
    estado_vehiculo?: number;
}
