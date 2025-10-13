import { User } from "src/user/entities/user.entity";
import { Vehiculo } from "src/vehiculo/entities/vehiculo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('historial_vehiculo')
export class HVehiculo {
    @PrimaryGeneratedColumn({ name: 'historial_id' })
    historial_id: number;

    @Column({ name: 'vehiculo_id' })
    vehiculo_id: number;

    @Column({ name: 'usuario_id' })
    usuario_id: number;

    @Column({
        name: 'fecha_evento',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false
    })
    fecha_evento: Date;

    @Column({
        name: 'descripcion',
        type: 'text',
        nullable: true
    })
    descripcion: string;

    @Column({
        name: 'tipo_evento',
        length: 50,
        nullable: false
    })
    tipo_evento: string;

    // Relaciones
    @ManyToOne(() => Vehiculo, vehiculo => vehiculo.historiales)
    @JoinColumn({ name: 'vehiculo_id' })
    vehiculo: Vehiculo;

    @ManyToOne(() => User, usuario => usuario.historialesVehiculo)
    @JoinColumn({ name: 'usuario_id' })
    usuario: User;

    @Column({
        name: 'estado',
        type: 'boolean',
        default: true,
        nullable: false
    })
    estado: boolean;
}
