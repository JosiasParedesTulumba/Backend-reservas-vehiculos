import { Injectable } from '@nestjs/common';
import { VehiculoService } from 'src/vehiculo/vehiculo.service';

@Injectable()
export class DashboardService {

    constructor(
        private vehiculoService: VehiculoService,
    ) { }

    async vehiculosDisponibles() {
        const vehiculos = await this.vehiculoService.findDisponibles();
        return {
            cantidad: vehiculos.length
        };
    }
}
