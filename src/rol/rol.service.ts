import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolService {
    constructor(
      @InjectRepository(Rol)
      private rolesRepository: Repository<Rol>
    ) {}

    async create(createRolDto: CreateRolDto): Promise<Rol> {
      const rol = this.rolesRepository.create({
        ...createRolDto,
        estado_rol: createRolDto.estado_rol ?? 1, // Por defecto activo
      });
      return await this.rolesRepository.save(rol);
    }

    async findAll(): Promise<Rol[]> {
      return await this.rolesRepository.find({
        where: { estado_rol: 1 }, // Solo roles activos
        order: { nombre_rol: 'ASC' }
      });
    }

    async findOne(rol_id: number) {
      const rol = await this.rolesRepository.findOne({
        where: { rol_id, estado_rol: 1 }
      });
  
      if (!rol) {
        throw new NotFoundException('Rol no encontrado');
      }
  
      return rol;
    }

    async update(rol_id: number, updateRolDto: UpdateRolDto) {
      const rol = await this.findOne(rol_id);
      await this.rolesRepository.update(rol, updateRolDto);
      return this.findOne(rol_id);
    }
  
    async remove(rol_id: number) {
      const rol = await this.findOne(rol_id);
      // Soft delete - cambiar estado a 0
      await this.rolesRepository.update(rol_id, { estado_rol: 0 });
      return { message: 'Rol eliminado correctamente' };
    }
  
}
