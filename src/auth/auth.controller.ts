import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  // LOGIN (público)

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ENDPOINTS PROTEGIDOS (requieren token)

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Request() req) {
    const profile = await this.authService.getProfile(req.user.usuario_id);
    return {
      mensaje: 'Usuario autenticado',
      usuario: profile
    };
  }

  // ENDPOINTS DE PRUEBA POR ROLES

  @Get('test/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  testAdmin(@Request() req) {
    return {
      mensaje: 'Solo ADMINS pueden ver esto',
      usuario: req.user,
      rol_permitido: 'ADMIN'
    };
  }

  @Get('test/empleado')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO')
  testEmpleado(@Request() req) {
    return {
      mensaje: 'ADMIN y EMPLEADOS pueden ver esto',
      usuario: req.user,
      roles_permitidos: ['ADMIN', 'EMPLEADO']
    };
  }

  @Get('test/supervisor')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  testSupervisor(@Request() req) {
    return {
      mensaje: 'Todos los roles pueden ver esto',
      usuario: req.user,
      roles_permitidos: ['ADMIN', 'EMPLEADO', 'SUPERVISOR']
    };
  }
}
