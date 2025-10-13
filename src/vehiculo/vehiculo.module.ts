import { Module } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HVehiculo } from 'src/h-vehiculo/entities/h-vehiculo.entity';


@Module({
  imports:[
    TypeOrmModule.forFeature([Vehiculo, HVehiculo]),
    AuthModule
  ],
  controllers: [VehiculoController],
  providers: [VehiculoService],
  exports: [VehiculoService]
})
export class VehiculoModule {}
