import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { Reserva } from '../reserva/entities/reserva.entity';
import { EstadoReserva } from '../reserva/entities/reserva.entity';

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

        // ✅ Primero actualizar estados de reservas
        await this.actualizarEstadosReservas();

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

    // Actualizar estados de reservas automáticamente
    async actualizarEstadosReservas() {
        const ahora = new Date();
        let actualizadas = 0;

        // 1. CONFIRMADA → COMPLETADA (Si ya pasó la fecha de fin y seguía confirmada)
        // Esto corrige reservas viejas que no pasaron por EN_CURSO a tiempo
        const reservasViejas = await this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.estado_reserva = :confirmada', { confirmada: EstadoReserva.CONFIRMADA })
            .andWhere('reserva.fecha_fin <= :ahora', { ahora })
            .getMany();

        for (const reserva of reservasViejas) {
            await this.reservaRepository.update(
                { reserva_id: reserva.reserva_id },
                { estado_reserva: EstadoReserva.COMPLETADA }
            );
            actualizadas++;
            this.logger.debug(`Reserva ${reserva.reserva_id}: CONFIRMADA → COMPLETADA (Directo por fecha pasada)`);
        }

        // 2. CONFIRMADA → EN_CURSO (cuando llega la fecha de inicio y aún no termina)
        const reservasParaIniciar = await this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.estado_reserva = :confirmada', { confirmada: EstadoReserva.CONFIRMADA })
            .andWhere('reserva.fecha_inicio <= :ahora', { ahora })
            .andWhere('reserva.fecha_fin > :ahora', { ahora })
            .getMany();

        for (const reserva of reservasParaIniciar) {
            await this.reservaRepository.update(
                { reserva_id: reserva.reserva_id },
                { estado_reserva: EstadoReserva.EN_CURSO }
            );
            actualizadas++;
            this.logger.debug(`Reserva ${reserva.reserva_id}: CONFIRMADA → EN_CURSO`);
        }

        // 3. EN_CURSO → COMPLETADA (cuando pasa la fecha de fin)
        const reservasParaCompletar = await this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.estado_reserva = :enCurso', { enCurso: EstadoReserva.EN_CURSO })
            .andWhere('reserva.fecha_fin <= :ahora', { ahora })
            .getMany();

        for (const reserva of reservasParaCompletar) {
            await this.reservaRepository.update(
                { reserva_id: reserva.reserva_id },
                { estado_reserva: EstadoReserva.COMPLETADA }
            );
            actualizadas++;
            this.logger.debug(`Reserva ${reserva.reserva_id}: EN_CURSO → COMPLETADA`);
        }

        if (actualizadas > 0) {
            this.logger.log(`✅ ${actualizadas} reservas actualizadas automáticamente`);
        }
    }

    async calcularEstado(vehiculo_id: number): Promise<number> {
        const fechaActual = new Date();

        // 1. Buscar si hay una reserva activa EN CURSO
        const reservaEnCurso = await this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.vehiculo_id = :vehiculoId', { vehiculoId: vehiculo_id })
            .andWhere('reserva.estado_reserva = :enCurso', { enCurso: EstadoReserva.EN_CURSO })
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
            .andWhere('reserva.estado_reserva = :confirmada', { confirmada: EstadoReserva.CONFIRMADA })
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
