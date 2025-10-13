export class CreatePersonaDto {
    dni?: string;
    nombre: string;
    apellido: string;
    telefono: string;
    correo: string;
    direccion: string;
    tipo_persona: number; // 1 = cliente, 2 = empleado
    puesto: string;

    // Campos adicionales para empleados (cuando tipo_persona = 2)
    nombre_usuario?: string;
    contrasena?: string;
    rol_id?: number;
}
