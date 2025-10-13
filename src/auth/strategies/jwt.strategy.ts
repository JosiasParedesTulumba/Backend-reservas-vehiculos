import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(private userService: UserService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'clave_secreta_reservas',
        });
    }

    async validate(payload: any) {
        // Validar que el usuario sigue existiendo y activo
        const usuario = await this.userService.findOne(payload.usuario_id);
        if (!usuario) {
          throw new UnauthorizedException('Usuario no válido');
        }
        return usuario;
      }
}