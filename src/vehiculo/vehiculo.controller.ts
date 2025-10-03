import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { AdminGuard, EmpleadoGuard, SupervisorGuard } from 'src/auth/guards/auth.guard';

@Controller('vehiculo')
export class VehiculoController {

  constructor(private readonly vehiculoService: VehiculoService) { }

  // ENDPOINTS PÚBLICOS/SUPERVISOR

  // Listar todos los vehículos
  @Get()
  @UseGuards(SupervisorGuard) // Todos pueden ver
  findAll() {
    return this.vehiculoService.findAll();
  }

  // Ver vehículo específico
  @Get(':id')
  @UseGuards(SupervisorGuard)
  findOne(@Param('id') id: string) {
    return this.vehiculoService.findOne(+id);
  }

  // Vehículos disponibles (para hacer reservas)
  @Get('estado/disponibles')
  @UseGuards(EmpleadoGuard) // Admin y Empleado
  findDisponibles() {
    return this.vehiculoService.findDisponibles();
  }

  // Buscar por tipo
  @Get('tipo/:tipo')
  @UseGuards(SupervisorGuard)
  findByTipo(@Param('tipo') tipo: string) {
    return this.vehiculoService.findByTipo(+tipo);
  }

  // Estadísticas
  @Get('estadisticas/general')
  @UseGuards(SupervisorGuard)
  getStats() {
    return this.vehiculoService.getStats();
  }

  // ENDPOINTS PROTEGIDOS (Admin/Empleado)

  // Crear vehículo
  @Post()
  @UseGuards(EmpleadoGuard) // Admin y Empleado pueden crear
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculoService.create(createVehiculoDto);
  }

  // Actualizar vehículo
  @Patch(':id')
  @UseGuards(EmpleadoGuard) // Admin y Empleado pueden actualizar
  update(@Param('id') id: string, @Body() updateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculoService.update(+id, updateVehiculoDto);
  }

  // Cambiar estado del vehículo
  @Patch(':id/estado')
  @UseGuards(EmpleadoGuard)
  cambiarEstado(
    @Param('id') id: string,
    @Body() body: { estado_vehiculo: number }
  ) {
    return this.vehiculoService.cambiarEstado(+id, body.estado_vehiculo);
  }

  // Eliminar vehículo
  @Delete(':id')
  @UseGuards(AdminGuard) // Solo admin puede eliminar
  remove(@Param('id') id: string) {
    return this.vehiculoService.remove(+id);
  }

}
