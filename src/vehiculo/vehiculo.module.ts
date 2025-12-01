import { Module } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HVehiculo } from 'src/h-vehiculo/entities/h-vehiculo.entity';
import { Reserva } from 'src/reserva/entities/reserva.entity';
import { VehicleStatusScheduler } from './vehicle-status.scheduler';


@Module({
  imports: [
    TypeOrmModule.forFeature([Vehiculo, HVehiculo, Reserva]),
    AuthModule
  ],
  controllers: [VehiculoController],
  providers: [VehiculoService, VehicleStatusScheduler],
  exports: [VehiculoService, VehicleStatusScheduler]
})
export class VehiculoModule { }
