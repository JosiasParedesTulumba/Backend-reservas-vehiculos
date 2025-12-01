import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { Reserva } from '../reserva/entities/reserva.entity';

@Injectable()
export class VehicleStatusScheduler {
    private readonly logger = new Logger(VehicleStatusScheduler.name);

    constructor(
        @InjectRepository(Vehiculo)
        private vehiculoRepository: Repository<Vehiculo>,
        @InjectRepository(Reserva)
        private reservaRepository: Repository<Reserva>,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async actualizarEstadosAutomaticamente() {
        this.logger.log('🔄 Actualizando estados de vehículos automáticamente...');

        const vehiculos = await this.vehiculoRepository.find({
            where: { estado_actual: 1 } // Solo vehículos activos
        });

        let actualizados = 0;
        for (const vehiculo of vehiculos) {
            const nuevoEstado = await this.calcularEstado(vehiculo.vehiculo_id);

            if (vehiculo.estado_vehiculo !== nuevoEstado) {
                await this.vehiculoRepository.update(
                    { vehiculo_id: vehiculo.vehiculo_id },
                    { estado_vehiculo: nuevoEstado }
                );
                actualizados++;
                this.logger.debug(
                    `Vehículo ${vehiculo.matricula}: ${this.getNombreEstado(vehiculo.estado_vehiculo)} → ${this.getNombreEstado(nuevoEstado)}`
                );
            }
        }

        this.logger.log(`✅ Actualización completada. ${actualizados} vehículos actualizados.`);
    }

    async calcularEstado(vehiculo_id: number): Promise<number> {
        const fechaActual = new Date();

        // 1. Buscar si hay una reserva activa EN CURSO
        const reservaEnCurso = await this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.vehiculo_id = :vehiculoId', { vehiculoId: vehiculo_id })
            .andWhere('reserva.estado_reserva = 1') // Solo reservas activas
            .andWhere('reserva.fecha_inicio <= :fechaActual', { fechaActual })
            .andWhere('reserva.fecha_fin >= :fechaActual', { fechaActual })
            .getOne();

        if (reservaEnCurso) {
            return 1; // OCUPADO
        }

        // 2. Buscar si hay una reserva FUTURA
        const reservaFutura = await this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.vehiculo_id = :vehiculoId', { vehiculoId: vehiculo_id })
            .andWhere('reserva.estado_reserva = 1') // Solo reservas activas
            .andWhere('reserva.fecha_inicio > :fechaActual', { fechaActual })
            .orderBy('reserva.fecha_inicio', 'ASC')
            .getOne();

        if (reservaFutura) {
            return 2; // RESERVADO
        }

        // 3. Sin reservas activas
        return 3; // DISPONIBLE
    }

    private getNombreEstado(estado: number): string {
        switch (estado) {
            case 1: return 'OCUPADO';
            case 2: return 'RESERVADO';
            case 3: return 'DISPONIBLE';
            default: return 'DESCONOCIDO';
        }
    }
}
