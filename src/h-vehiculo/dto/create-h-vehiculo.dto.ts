export class CreateHVehiculoDto {
    vehiculo_id: number;
    usuario_id: number;
    fecha_evento?: Date;
    descripcion?: string;
    tipo_evento: string;
}
