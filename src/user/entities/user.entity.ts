import { Persona } from "src/persona/entities/persona.entity";
import { Rol } from "src/rol/entities/rol.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuario')
export class User {

    @PrimaryGeneratedColumn()
    usuario_id: number;

    @Column()
    rol_id: number;

    @Column()
    persona_id: number;

    @Column({ length: 100 })
    nombre_usuario: string;

    @Column({ length: 100 })
    contrasena: string;

    @Column({ type: 'tinyint', nullable: true })
    estado_usuario: number;

    @ManyToOne(() => Rol, rol => rol.usuarios)
    @JoinColumn({ name: 'rol_id' })
    rol: Rol;

    @OneToOne(() => Persona, persona => persona.usuario)
    @JoinColumn({ name: 'persona_id' })
    persona: Persona;

}
