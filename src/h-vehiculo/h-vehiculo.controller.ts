import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { HVehiculoService } from './h-vehiculo.service';
import { CreateHVehiculoDto } from './dto/create-h-vehiculo.dto';
import { UpdateHVehiculoDto } from './dto/update-h-vehiculo.dto';
import { HVehiculo } from './entities/h-vehiculo.entity';
import { EmpleadoGuard, SupervisorGuard } from '../auth/guards/auth.guard';

@Controller('h-vehiculo')
@UseGuards(SupervisorGuard) // Proteger todas las rutas por defecto
@UseGuards(EmpleadoGuard) // Permite también a empleados
export class HVehiculoController {
  constructor(private readonly hVehiculoService: HVehiculoService) { }

  @Post()
  async create(
    @Body() createHVehiculoDto: CreateHVehiculoDto,
    @Req() req,
  ): Promise<HVehiculo> 
    {
    return await this.hVehiculoService.create(createHVehiculoDto, req.user.usuario_id);
  }

  @Get()
  async findAll(): Promise<HVehiculo[]> {
    return await this.hVehiculoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HVehiculo> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new Error('ID debe ser un número');
    }
    return await this.hVehiculoService.findOne(idNum);
  }

  @Patch(':id')
  async update( @Param('id') id: string, @Body() updateHVehiculoDto: UpdateHVehiculoDto ): Promise<HVehiculo> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new Error('ID debe ser un número');
    }
    return await this.hVehiculoService.update(idNum, updateHVehiculoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new Error('ID debe ser un número');
    }
    await this.hVehiculoService.remove(idNum);
  }
}
