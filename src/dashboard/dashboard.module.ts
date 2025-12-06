import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';

import { ReservaModule } from 'src/reserva/reserva.module';

@Module({
  imports: [VehiculoModule, ReservaModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
