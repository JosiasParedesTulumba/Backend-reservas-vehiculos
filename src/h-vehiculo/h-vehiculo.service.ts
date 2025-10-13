import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHVehiculoDto } from './dto/create-h-vehiculo.dto';
import { UpdateHVehiculoDto } from './dto/update-h-vehiculo.dto';
import { HVehiculo } from './entities/h-vehiculo.entity';

@Injectable()
export class HVehiculoService {
  constructor(
    @InjectRepository(HVehiculo)
    private readonly hVehiculoRepository: Repository<HVehiculo>,
  ) { }

  async create(createHVehiculoDto: CreateHVehiculoDto): Promise<HVehiculo> {
    const hVehiculo = this.hVehiculoRepository.create({
      ...createHVehiculoDto,
      fecha_evento: createHVehiculoDto.fecha_evento || new Date(),
    });
    return await this.hVehiculoRepository.save(hVehiculo);
  }

  async findAll(): Promise<HVehiculo[]> {
    return await this.hVehiculoRepository.find({
      relations: ['vehiculo', 'usuario'],
    });
  }

  async findOne(id: number): Promise<HVehiculo> {
    const hVehiculo = await this.hVehiculoRepository.findOne({
      where: { historial_id: id },
      relations: ['vehiculo', 'usuario'],
    });

    if (!hVehiculo) {
      throw new NotFoundException(`Historial de vehículo con ID ${id} no encontrado`);
    }

    return hVehiculo;
  }

  async update(
    id: number,
    updateHVehiculoDto: UpdateHVehiculoDto,
  ): Promise<HVehiculo> {
    const hVehiculo = await this.findOne(id);

    const updated = this.hVehiculoRepository.merge(hVehiculo, updateHVehiculoDto);
    return await this.hVehiculoRepository.save(updated);
  }

  async remove(id: number): Promise<HVehiculo> {
    const hVehiculo = await this.findOne(id);
    
    // Realizar eliminación lógica estableciendo estado a false
    hVehiculo.estado = false;
    
    // Guardar los cambios
    return await this.hVehiculoRepository.save(hVehiculo);
  }
}
