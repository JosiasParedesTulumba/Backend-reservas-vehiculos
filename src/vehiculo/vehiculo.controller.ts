import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('vehiculo')
export class VehiculoController {

  constructor(private readonly vehiculoService: VehiculoService) { }

  // ENDPOINTS PÚBLICOS/SUPERVISOR

  // Listar todos los vehículos
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findAll() {
    return this.vehiculoService.findAll();
  }

  // Obtener matrículas de vehículos y mostrar en un select
  @Get('matriculas/lista')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO')
  getMatriculas() {
    return this.vehiculoService.getMatriculas();
  }

  // Ver vehículo específico
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findOne(@Param('id') id: string) {
    return this.vehiculoService.findOne(+id);
  }

  // Vehículos disponibles (para hacer reservas)
  @Get('estado/disponibles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO')
  findDisponibles() {
    return this.vehiculoService.findDisponibles();
  }

  // Buscar por tipo
  @Get('tipo/:tipo')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findByTipo(@Param('tipo') tipo: string) {
    return this.vehiculoService.findByTipo(+tipo);
  }

  // Estadísticas
  @Get('estadisticas/general')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  getStats() {
    return this.vehiculoService.getStats();
  }

  // ENDPOINTS PROTEGIDOS (Admin/Empleado)

  // Crear vehículo
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO')
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculoService.create(createVehiculoDto);
  }

  // Actualizar vehículo
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO')
  update(@Param('id') id: string, @Body() updateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculoService.update(+id, updateVehiculoDto);
  }

  // Cambiar estado del vehículo
  @Patch(':id/estado')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO')
  cambiarEstado(
    @Param('id') id: string,
    @Body() body: { estado_vehiculo: number }
  ) {
    return this.vehiculoService.cambiarEstado(+id, body.estado_vehiculo);
  }

  // Eliminar vehículo
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.vehiculoService.remove(+id);
  }

}
