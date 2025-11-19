import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'clave_secreta_reservas',
      signOptions: { expiresIn: '24h' }, // Token válido por 24 horas
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    }
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
