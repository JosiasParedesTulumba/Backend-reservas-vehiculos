import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {

    constructor(
        private dashboardService: DashboardService,
    ) { }

    @Get('cantidad/disponibles')
    async vehiculosDisponibles() {
        return await this.dashboardService.vehiculosDisponibles();
    }
}
