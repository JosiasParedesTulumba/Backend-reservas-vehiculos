import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // MÉTODO ESPECIAL para probar login
  @Get('test-login/:username')
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
        persona: `${usuario.persona.nombre} ${usuario.persona.apellido}`
      }
    };
  }

}
