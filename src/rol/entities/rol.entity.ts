import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rol')
export class Rol {

    @PrimaryGeneratedColumn()
    rol_id: number;

    @Column({ length: 50 })
    nombre_rol: string;

    @Column({ type: 'tinyint' })
    estado_rol: number;

    @OneToMany(() => User, user => user.rol)
    usuarios: User[]
}
