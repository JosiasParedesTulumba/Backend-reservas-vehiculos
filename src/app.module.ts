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
import { HVehiculoModule } from './h-vehiculo/h-vehiculo.module';
import { HVehiculo } from './h-vehiculo/entities/h-vehiculo.entity';
import { Reserva } from './reserva/entities/reserva.entity';
import { Pago } from './pago/entities/pago.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'bd_gestion_reservas_v',
      entities: [User, Persona, Rol, Vehiculo, HVehiculo, Reserva, Pago],
      synchronize: false,
      logging: false,
    }),
    AuthModule,
    UserModule,
    VehiculoModule,
    PersonaModule,
    RolModule,
    ReservaModule,
    PagoModule,
    HVehiculoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
