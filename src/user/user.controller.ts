import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('ADMIN', 'EMPLEADO')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'EMPLEADO')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // MÉTODO ESPECIAL para probar login (solo para desarrollo)
  @Get('test-login/:username')
  @Roles('ADMIN') // Solo administradores pueden usar esta herramienta de desarrollo
  async testLogin(@Param('username') username: string) {
    const usuario = await this.userService.findByUsername(username);
    if (!usuario) {
      return { message: 'Usuario no encontrado' };
    }
    
    return {
      message: 'Usuario encontrado para login',
      usuario: {
        usuario_id: usuario.usuario_id,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol.nombre_rol,
        persona: usuario.persona ? `${usuario.persona.nombre} ${usuario.persona.apellido}` : 'Sin persona asociada'
      }
    };
  }

}
