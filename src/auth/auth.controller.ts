import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { AdminGuard, EmpleadoGuard, SimpleAuthGuard, SupervisorGuard } from './guards/auth.guard';

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
  @UseGuards(SimpleAuthGuard)
  async getMe(@Request() req) {
    const profile = await this.authService.getProfile(req.user.usuario_id);
    return {
      mensaje: 'Usuario autenticado',
      usuario: profile
    };
  }

  // ENDPOINTS DE PRUEBA POR ROLES

  @Get('test/admin')
  @UseGuards(AdminGuard)
  testAdmin(@Request() req) {
    return {
      mensaje: '✅ Solo ADMINS pueden ver esto',
      usuario: req.user,
      rol_permitido: 'ADMIN'
    };
  }

  @Get('test/empleado')
  @UseGuards(EmpleadoGuard)
  testEmpleado(@Request() req) {
    return {
      mensaje: '✅ ADMIN y EMPLEADOS pueden ver esto',
      usuario: req.user,
      roles_permitidos: ['ADMIN', 'EMPLEADO']
    };
  }

  @Get('test/supervisor')
  @UseGuards(SupervisorGuard)
  testSupervisor(@Request() req) {
    return {
      mensaje: '✅ Todos los roles pueden ver esto',
      usuario: req.user,
      roles_permitidos: ['ADMIN', 'EMPLEADO', 'SUPERVISOR']
    };
  }
}
