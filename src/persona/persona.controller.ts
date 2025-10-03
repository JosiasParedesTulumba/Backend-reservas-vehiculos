import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { AdminGuard, EmpleadoGuard, SupervisorGuard } from 'src/auth/guards/auth.guard';

@Controller('persona')
export class PersonaController {

  constructor(private readonly personaService: PersonaService) { }

  // Crear Persona 
  @Post()
  @UseGuards(EmpleadoGuard) // Solo admin y empleado pueden crear personas
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personaService.create(createPersonaDto)
  }

  // CONSULTAS (todos los supervisores+ pueden ver)

  @Get()
  @UseGuards(SupervisorGuard) // Todos los roles pueden ver personas
  findAll() {
    return this.personaService.findAll();
  }

  @Get('clientes')
  @UseGuards(SupervisorGuard)
  findClientes() {
    return this.personaService.findClientes();
  }

  @Get('empleados')
  @UseGuards(SupervisorGuard)
  findEmpleados() {
    return this.personaService.findEmpleados();
  }

  @Get('stats')
  @UseGuards(SupervisorGuard)
  getStats() {
    return this.personaService.getStats();
  }

  @Get('buscar-dni')
  @UseGuards(SupervisorGuard)
  findByDni(@Query('dni') dni: string) {
    if (!dni) {
      return { message: 'DNI requerido', ejemplo: '/api/personas/buscar-dni?dni=12345678' };
    }
    return this.personaService.findByDni(dni);
  }

  @Get(':id')
  @UseGuards(SupervisorGuard)
  findOne(@Param('id') id: string) {
    return this.personaService.findOne(+id);
  }

  // Actualizar y eliminar permisos mas restrictivos
  @Patch(':id')
  @UseGuards(EmpleadoGuard) // Admin y Empleado pueden actualizar
  update(@Param('id') id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personaService.update(+id, updatePersonaDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard) // Solo admin puede eliminar personas
  remove(@Param('id') id: string) {
    return this.personaService.remove(+id);
  }
}
