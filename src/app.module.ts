import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { PersonaModule } from './persona/persona.module';
import { RolModule } from './rol/rol.module';
import { ReservaModule } from './reserva/reserva.module';
import { PagoModule } from './pago/pago.module';
import { User } from './user/entities/user.entity';
import { Persona } from './persona/entities/persona.entity';
import { Rol } from './rol/entities/rol.entity';
import { Vehiculo } from './vehiculo/entities/vehiculo.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: false,
      logging: true,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false,
    }),
    AuthModule,
    UserModule,
    VehiculoModule,
    PersonaModule,
    RolModule,
    ReservaModule,
    PagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
