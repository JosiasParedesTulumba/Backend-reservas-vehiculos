import { Reserva } from "src/reserva/entities/reserva.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('persona')
export class Persona {

    @PrimaryGeneratedColumn()
    persona_id: number;

    @Column({ unique: true, length: 8 })
    dni: string;

    @Column({ length: 100 })
    nombre: string;

    @Column({ length: 100 })
    apellido: string;

    @Column({ length: 15 })
    telefono: string;

    @Column({ length: 100 })
    correo: string;

    @Column({ length: 255 })
    direccion: string;

    @Column({ type: 'datetime' })
    fecha_creacion: Date;

    @Column({ type: 'tinyint' })
    tipo_persona: number; // 1 = cliente, 2 = empleado

    @Column({ type: 'tinyint' })
    estado_persona: number;

    @Column({ length: 100 })
    puesto: string;

    @OneToOne(() => User, user => user.persona)
    usuario: User;

    @OneToMany(() => Reserva, reserva => reserva.persona)
    reserva: Reserva[];

}
