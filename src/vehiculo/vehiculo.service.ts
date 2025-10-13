import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VehiculoService {
    constructor(
        @InjectRepository(Vehiculo)
        private vehiculoRepository: Repository<Vehiculo>
    ) { }

    // Crear Vehiculo
    async create(createVehiculoDto: CreateVehiculoDto) {
        // Verificar si la matricula no exista
        const existeMatricula = await this.vehiculoRepository.findOne({
            where: { matricula: createVehiculoDto.matricula }  
        });

        if (existeMatricula) {
            throw new BadRequestException('La matricula ya esta registrada');
        }

        const vehiculo = this.vehiculoRepository.create({
            ...createVehiculoDto,
            estado_actual: createVehiculoDto.estado_actual ?? 1,
            estado_vehiculo: createVehiculoDto.estado_vehiculo ?? 3
        });

        return await this.vehiculoRepository.save(vehiculo);
    }

    async findAll() {
        return await this.vehiculoRepository.find({
            where: { estado_actual: 1 }, // Solo vehiculos activos
            order: { fecha_creacion: 'DESC' }, // Ordenar por fecha de creacion
        });
    }

    async findOne(vehiculo_id: number) {
        const vehiculo = await this.vehiculoRepository.findOne({
            where: { vehiculo_id },
        });

        if (!vehiculo) {
            throw new NotFoundException('Vehiculo no encontrado');
        }

        return vehiculo;
    }

    async findDisponibles() {
        return await this.vehiculoRepository.find({
            where: {
                estado_actual: 1, // Activos
                estado_vehiculo: 3 // Disponibles
            },
            order: { modelo: 'ASC' }, // Ordenar por fecha de creacion
        })
    }

    // Buscar por tipo de Vehiculo
    async findByTipo(tipo_vehiculo: number) {
        return await this.vehiculoRepository.find({
            where: {
                tipo_vehiculo,
                estado_actual: 1
            },
            order: { modelo: 'ASC' }
        });
    }

    // Actualizar Vehiculo
    async update(vehiculo_id: number, updateVehiculoDto: UpdateVehiculoDto) {
        const vehiculo = await this.findOne(vehiculo_id);

        //Si se actualiza la matricula, verificar que no exista 
        if (updateVehiculoDto.matricula && updateVehiculoDto.matricula !== vehiculo.matricula) {
            const existeMatricula = await this.vehiculoRepository.findOne({
                where: { matricula: updateVehiculoDto.matricula }
            });

            if (existeMatricula) {
                throw new BadRequestException('La matricula ya esta registrada');
            }
        }

        await this.vehiculoRepository.update(vehiculo_id, updateVehiculoDto);

        return this.findOne(vehiculo_id);
    }

    // Eliminar Vehiculo
    async remove(vehiculo_id: number) {
        const vehiculo = await this.findOne(vehiculo_id);
        await this.vehiculoRepository.delete(vehiculo_id);
        return { message: 'Vehículo eliminado correctamente' };
    }

    // Cambiar estado del vehículo (disponible, reservado, mantenimiento)
    async cambiarEstado(vehiculo_id: number, estado_vehiculo: number) {
        const vehiculo = await this.findOne(vehiculo_id);
        await this.vehiculoRepository.update(vehiculo_id, { estado_vehiculo });
        return this.findOne(vehiculo_id);
    }

    // Obtener estadísticas
    async getStats() {
        const total = await this.vehiculoRepository.count({
            where: { estado_actual: 1 }
        });

        const disponibles = await this.vehiculoRepository.count({
            where: { estado_actual: 1, estado_vehiculo: 3 }
        });

        const reservados = await this.vehiculoRepository.count({
            where: { estado_actual: 1, estado_vehiculo: 2 }
        });

        const mantenimiento = await this.vehiculoRepository.count({
            where: { estado_actual: 1, estado_vehiculo: 1 }
        });

        return {
            total_vehiculos: total,
            disponibles,
            reservados,
            en_mantenimiento: mantenimiento
        };
    }
}
