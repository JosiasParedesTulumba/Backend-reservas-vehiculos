import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto) {
    const { nombre_usuario, contrasena } = loginDto;

    // 1. Buscar usuario por nombre de usuario
    const usuario = await this.usersService.findByUsername(nombre_usuario);



    // 2. Verificar que existe y la contraseña es correcta
    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Crear payload para JWT
    const payload = {
      usuario_id: usuario.usuario_id,
      nombre_usuario: usuario.nombre_usuario,
      rol: usuario.rol.nombre_rol,
      persona_id: usuario.persona_id,
      nombre_completo: `${usuario.persona.nombre} ${usuario.persona.apellido}`,
    };

    // 4. Generar token y retornar información del usuario
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        usuario_id: usuario.usuario_id,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol.nombre_rol,
        nombre_completo: `${usuario.persona.nombre} ${usuario.persona.apellido}`,
        email: usuario.persona.correo,
        telefono: usuario.persona.telefono,
        puesto: usuario.persona.puesto,
      },
    };
  }

  async getProfile(usuario_id: number) {
    return await this.usersService.findOne(usuario_id);
  }
}
