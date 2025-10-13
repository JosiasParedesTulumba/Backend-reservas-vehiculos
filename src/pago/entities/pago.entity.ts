import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pago')
export class Pago {
    @PrimaryGeneratedColumn()
    pago_id: number;

    
}
