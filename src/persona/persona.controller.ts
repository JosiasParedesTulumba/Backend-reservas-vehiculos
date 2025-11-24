import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('persona')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PersonaController {

  constructor(private readonly personaService: PersonaService) { }

  // Crear Persona 
  @Post()
  @Roles('ADMIN', 'EMPLEADO')
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personaService.create(createPersonaDto)
  }

  // CONSULTAS (todos los supervisores+ pueden ver)

  @Get()
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findAll() {
    return this.personaService.findAll();
  }

  @Get('clientes')
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findClientes() {
    return this.personaService.findClientes();
  }

  @Get('empleados')
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findEmpleados() {
    return this.personaService.findEmpleados();
  }

  @Get('stats')
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  getStats() {
    return this.personaService.getStats();
  }

  @Get('buscar-dni')
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findByDni(@Query('dni') dni: string) {
    if (!dni) {
      return { message: 'DNI requerido', ejemplo: '/api/personas/buscar-dni?dni=12345678' };
    }
    return this.personaService.findByDni(dni);
  }

  @Get(':id')
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findOne(@Param('id') id: string) {
    return this.personaService.findOne(+id);
  }

  // Actualizar y eliminar permisos mas restrictivos
  @Patch(':id')
  @Roles('ADMIN', 'EMPLEADO')
  update(@Param('id') id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personaService.update(+id, updatePersonaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.personaService.remove(+id);
  }
}
