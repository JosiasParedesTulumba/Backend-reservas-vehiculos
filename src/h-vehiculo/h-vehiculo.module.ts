import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HVehiculo } from './entities/h-vehiculo.entity';
import { HVehiculoService } from './h-vehiculo.service';
import { HVehiculoController } from './h-vehiculo.controller';
import { VehiculoModule } from '../vehiculo/vehiculo.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HVehiculo]),
    AuthModule,
    VehiculoModule,
    UserModule,
  ],
  controllers: [HVehiculoController],
  providers: [HVehiculoService],
  exports: [HVehiculoService],
})
export class HVehiculoModule {}
