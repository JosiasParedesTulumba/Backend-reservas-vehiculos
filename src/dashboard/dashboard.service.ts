import { Injectable } from '@nestjs/common';
import { VehiculoService } from 'src/vehiculo/vehiculo.service';
import { ReservaService } from 'src/reserva/reserva.service';
import { EstadoReserva } from 'src/reserva/entities/reserva.entity';

@Injectable()
export class DashboardService {

    constructor(
        private vehiculoService: VehiculoService,
        private reservaService: ReservaService,
    ) { }

    async vehiculosDisponibles() {
        const vehiculos = await this.vehiculoService.findDisponibles();
        return {
            cantidad: vehiculos.length
        };
    }

    async reservasActivas() {
        // Consideramos activas las CONFIRMADAS (2) y EN_CURSO (3)
        const confirmadas = await this.reservaService.findByEstado(EstadoReserva.CONFIRMADA);
        const enCurso = await this.reservaService.findByEstado(EstadoReserva.EN_CURSO);

        return {
            cantidad: confirmadas.length + enCurso.length
        };
    }
}
