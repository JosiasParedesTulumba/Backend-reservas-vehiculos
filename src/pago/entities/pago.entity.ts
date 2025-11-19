import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reserva } from "src/reserva/entities/reserva.entity";
import { User } from "src/user/entities/user.entity";

@Entity('pago')
export class Pago {

    @PrimaryGeneratedColumn()
    pago_id: number;

    @ManyToOne(() => Reserva, reserva => reserva.pago)
    @JoinColumn({ name: 'reserva_id' })
    reserva: Reserva;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'usuario_id' })
    usuario: User;

    @Column({ type: 'datetime' })
    fecha_pago: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: string;

    @Column({ type: 'tinyint' })
    metodo_pago: number;

    @Column({ type: 'tinyint' })
    estado_pago: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 })
    monto_ajuste: string | null;
}
