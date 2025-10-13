import { HVehiculo } from "src/h-vehiculo/entities/h-vehiculo.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('vehiculo')
export class Vehiculo {
    @PrimaryGeneratedColumn()
    vehiculo_id: number;

    @Column()
    usuario_id: number;

    @Column({ length: 100 })
    modelo: string;

    @Column({ length: 15, unique: true })
    matricula: string;

    @Column({ type: 'year' })
    anio: number;

    @Column({ type: 'tinyint' })
    tipo_vehiculo: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    @Column({ type: 'int' })
    capacidad: number;

    @Column({ type: 'tinyint', comment: 'Activo o Inactivo' })
    estado_actual: number;

    @Column({ type: 'tinyint', comment: 'Mantenimiento, Reservado, Libre' })
    estado_vehiculo: number;

    @CreateDateColumn()
    fecha_creacion?: Date;

    @UpdateDateColumn()
    fecha_actualizacion?: Date;

    // Relación con VehiculoHistory
    @OneToMany(() => HVehiculo, historial => historial.vehiculo)
    historiales: HVehiculo[];
}
