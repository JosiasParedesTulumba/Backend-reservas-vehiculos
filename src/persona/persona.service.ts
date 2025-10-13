import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { RolService } from 'src/rol/rol.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PersonaService {

    constructor(
        @InjectRepository(Persona)
        private personasRepository: Repository<Persona>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private userService: UserService,
        private rolesService: RolService
    ) { }

    // Metodo crear persona ( Cliente o Empleado )
    async create(createPersonaDTO: CreatePersonaDto) {
        const { tipo_persona, nombre_usuario, contrasena, rol_id, ...personaData } = createPersonaDTO;

        // 1. Crear la personas
        const persona = this.personasRepository.create({
            ...personaData,
            tipo_persona,
            fecha_creacion: new Date(),
            estado_persona: 1
        });

        const personaGuardada = await this.personasRepository.save(persona);

        // 2. Si es empleado (tipo_persona = 2), crear usuario automáticamente
        if (tipo_persona === 2) {
            if (!nombre_usuario || !contrasena || !rol_id) {
                // SI falta algun campo, eliminar la persona creada
                await this.personasRepository.delete(personaGuardada.persona_id);
                throw new BadRequestException('Para empleados se requiere: nombre_usuario, contrasena y rol_id');
            }

            try {
                // Verificar que el rol existe
                await this.rolesService.findOne(rol_id);

                // Crear usuario viculado a la persona
                await this.userService.create({
                    nombre_usuario,
                    contrasena,
                    rol_id,
                    persona_id: personaGuardada.persona_id,
                });

            } catch (error) {
                // SI falla crear el usuario, eliminar la persona 
                await this.personasRepository.delete(personaGuardada.persona_id);
                throw error;
            }
        }

        return this.findOne(personaGuardada.persona_id);
    }

    async findAll() {
        return await this.personasRepository.find({
            relations: ['usuario', 'usuario.rol'],
            where: { estado_persona: 1 },
            order: { fecha_creacion: 'DESC' }
        });
    }

    async findClientes() {
        return await this.personasRepository.find({
            where: { tipo_persona: 1, estado_persona: 1 }, // Solo clientes
            order: { fecha_creacion: 'DESC' }
        });
    }

    async findEmpleados() {
        return await this.personasRepository.find({
            relations: ['usuario', 'usuario.rol'],
            where: { tipo_persona: 2, estado_persona: 1 }, // Solo empleados
            order: { fecha_creacion: 'DESC' }
        });
    }

    async findOne(persona_id: number) {
        const persona = await this.personasRepository.findOne({
            where: { persona_id },
            relations: ['usuario', 'usuario.rol'],
        });

        if (!persona) {
            throw new NotFoundException('Persona no encontrada');
        }

        return persona;
    }

    // Actualizar persona

    async update(persona_id: number, updatePersonaDto: UpdatePersonaDto) {
        const persona = await this.findOne(persona_id);
        const { nombre_usuario, contrasena, rol_id, estado_usuario, ...personaData } = updatePersonaDto;

        // 1. Actualizar datos de persona
        if (Object.keys(personaData).length > 0) {
            await this.personasRepository.update(persona_id, personaData);
        }

        // 2. Si es empleado y tiene usuario, actualizar datos de usuario
        if (persona.tipo_persona === 2 && persona.usuario) {
            const updateUsuarioData: any = {};

            if (nombre_usuario) updateUsuarioData.nombre_usuario = nombre_usuario;
            if (contrasena) updateUsuarioData.contrasena = contrasena;
            if (rol_id) {
                // Verificar que el rol existe
                await this.rolesService.findOne(rol_id);
                updateUsuarioData.rol_id = rol_id;
            }
            if (estado_usuario !== undefined) updateUsuarioData.estado_usuario = estado_usuario;

            if (Object.keys(updateUsuarioData).length > 0) {
                await this.userService.update(persona.usuario.usuario_id, updateUsuarioData);
            }
        }

        return this.findOne(persona_id);
    }

    // Eliminar persona
    async remove(persona_id: number) {
        const persona = await this.findOne(persona_id);

        // Si es empleado, también desactivar usuario
        if (persona.tipo_persona === 2 && persona.usuario) {
            await this.userRepository.delete(persona.usuario.usuario_id);
        }

        // Elimina la persona de la BD 
        await this.personasRepository.delete(persona_id);

        // Soft delete de la persona (cambia el estado de la persona y no se visualiza)
        // await this.personasRepository.update(persona_id, { estado_persona: 0 });
        return { message: 'Persona eliminada correctamente' };
    }

    // Obtener estadísticas
    async getStats() {
        const totalClientes = await this.personasRepository.count({
            where: { tipo_persona: 1, estado_persona: 1 }
        });

        const totalEmpleados = await this.personasRepository.count({
            where: { tipo_persona: 2, estado_persona: 1 }
        });

        return {
            total_clientes: totalClientes,
            total_empleados: totalEmpleados,
            total_personas: totalClientes + totalEmpleados
        };
    }

    // Buscar por DNI
    async findByDni(dni: string) {
        return await this.personasRepository.findOne({
            where: { dni, estado_persona: 1 },
            relations: ['usuario', 'usuario.rol']
        });
    }
}
