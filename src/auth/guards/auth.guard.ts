import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SimpleAuthGuard implements CanActivate{

    constructor(private jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
    
        if (!token) {
          throw new UnauthorizedException('Token no encontrado');
        }
    
        try {
          const payload = this.jwtService.verify(token, { secret: 'clave_secreta_reservas' });
          request.user = payload; // Guardar datos del usuario en el request
          return true;
        } catch {
          throw new UnauthorizedException('Token inválido');
        }
      }
    
      private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
    
}

// GUARDS ESPECÍFICOS POR ROL

@Injectable()
export class AdminGuard extends SimpleAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const isAuthenticated = super.canActivate(context);
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    return request.user?.rol === 'ADMIN';
  }
}


@Injectable()
export class EmpleadoGuard extends SimpleAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const isAuthenticated = super.canActivate(context);
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    // ADMIN y EMPLEADO pueden pasar
    return ['ADMIN', 'EMPLEADO'].includes(request.user?.rol);
  }
}

@Injectable()
export class SupervisorGuard extends SimpleAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const isAuthenticated = super.canActivate(context);
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    // Todos los roles pueden pasar
    return ['ADMIN', 'EMPLEADO', 'SUPERVISOR'].includes(request.user?.rol);
  }
}