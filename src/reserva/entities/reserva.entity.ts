import { Pago } from "src/pago/entities/pago.entity";
import { Persona } from "src/persona/entities/persona.entity";
import { User } from "src/user/entities/user.entity";
import { Vehiculo } from "src/vehiculo/entities/vehiculo.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('reserva')
export class Reserva {

    @PrimaryGeneratedColumn({ name: 'reserva_id' })
    reserva_id: number;

    @ManyToOne(() => Vehiculo, vehiculo => vehiculo.reserva)
    @JoinColumn({ name: 'vehiculo_id' })
    vehiculo: Vehiculo;

    @ManyToOne(() => Persona, persona => persona.reserva)
    @JoinColumn({ name: 'persona_id' })
    persona: Persona;

    @ManyToOne(() => User, user => user.reserva)
    @JoinColumn({ name: 'usuario_id' })
    usuario: User;

    @OneToMany(() => Pago, pago => pago.reserva)
    pago: Pago[];

    @Column({ type: 'datetime'})
    fecha_reserva: Date;

    @Column({ type: 'datetime' })
    fecha_inicio: Date;

    @Column({ type: 'datetime' })
    fecha_fin: Date;

    @Column({ type: 'varchar' })
    descripcion: string;

    @Column({ type: 'tinyint' })
    estado_reserva: number;
}
