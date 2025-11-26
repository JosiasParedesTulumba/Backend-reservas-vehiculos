import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';

@Module({
  imports: [VehiculoModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
