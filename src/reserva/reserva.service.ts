import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { EstadoReserva } from './entities/reserva.entity';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';
import { Persona } from 'src/persona/entities/persona.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { VehicleStatusScheduler } from 'src/vehiculo/vehicle-status.scheduler';
import { Pago } from 'src/pago/entities/pago.entity';

@Injectable()
export class ReservaService {

    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
        @InjectRepository(Vehiculo)
        private readonly vehiculoRepository: Repository<Vehiculo>,
        @InjectRepository(Persona)
        private readonly personaRepository: Repository<Persona>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Pago)
        private readonly pagoRepository: Repository<Pago>,
        private readonly vehicleScheduler: VehicleStatusScheduler,
    ) { }

    async create(createReservaDto: CreateReservaDto, userId: number): Promise<Reserva> {
        // Verificar que el vehículo existe
        const vehiculo = await this.vehiculoRepository.findOne({
            where: { vehiculo_id: createReservaDto.vehiculo_id }
        });
        if (!vehiculo) {
            throw new NotFoundException(`Vehículo con ID ${createReservaDto.vehiculo_id} no encontrado`);
        }

        // Verificar que la persona existe
        const persona = await this.personaRepository.findOne({
            where: { persona_id: createReservaDto.persona_id }
        });
        if (!persona) {
            throw new NotFoundException(`Persona con ID ${createReservaDto.persona_id} no encontrada`);
        }

        // Obtener el usuario que realiza la reserva
        const usuario = await this.userRepository.findOne({
            where: { usuario_id: userId }
        });
        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
        }

        // Verificar disponibilidad del vehículo
        const reservaExistente = await this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.vehiculo_id = :vehiculoId', { vehiculoId: createReservaDto.vehiculo_id })
            .andWhere('reserva.estado_reserva IN (:...estados)', {
                estados: [EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO]
            })
            .andWhere(
                '(reserva.fecha_inicio <= :fechaFin AND reserva.fecha_fin >= :fechaInicio)',
                {
                    fechaInicio: createReservaDto.fecha_inicio,
                    fechaFin: createReservaDto.fecha_fin,
                },
            )
            .getOne();

        if (reservaExistente) {
            throw new Error('El vehículo ya está reservado para las fechas seleccionadas');
        }

        const reserva = this.reservaRepository.create({
            fecha_reserva: new Date(), // Fecha actual
            fecha_inicio: createReservaDto.fecha_inicio,
            fecha_fin: createReservaDto.fecha_fin,
            descripcion: createReservaDto.descripcion,
            estado_reserva: EstadoReserva.PENDIENTE, // Inicia como PENDIENTE
            vehiculo: { vehiculo_id: createReservaDto.vehiculo_id },
            persona: { persona_id: createReservaDto.persona_id },
            usuario: { usuario_id: userId }
        });

        const reservaGuardada = await this.reservaRepository.save(reserva);

        // No actualizamos estado del vehículo aquí porque está PENDIENTE
        // Se actualizará cuando se CONFIRME

        return reservaGuardada;

        return reservaGuardada;
    }

    async confirmarReserva(reserva_id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOne({
            where: { reserva_id: reserva_id },
            relations: ['vehiculo', 'persona', 'usuario', 'pago']
        });

        if (!reserva) {
            throw new NotFoundException(`Reserva con ID ${reserva_id} no encontrada`);
        }

        if (reserva.estado_reserva !== EstadoReserva.PENDIENTE) {
            throw new BadRequestException('Solo se pueden confirmar reservas pendientes');
        }

        if (!reserva.pago || reserva.pago.length === 0) {
            throw new BadRequestException('La reserva debe tener al menos un pago asociado para ser confirmada');
        }

        // Cambiar estado a CONFIRMADA
        reserva.estado_reserva = EstadoReserva.CONFIRMADA;
        const reservaConfirmada = await this.reservaRepository.save(reserva);

        // Actualizar estado del vehículo
        const nuevoEstado = await this.vehicleScheduler.calcularEstado(reserva.vehiculo.vehiculo_id);
        await this.vehiculoRepository.update(
            { vehiculo_id: reserva.vehiculo.vehiculo_id },
            { estado_vehiculo: nuevoEstado }
        );

        return reservaConfirmada;
    }

    async findAll(): Promise<Reserva[]> {
        return await this.reservaRepository.find({
            relations: ['vehiculo', 'persona', 'usuario', 'pago'],
            order: { fecha_reserva: 'ASC' }
        });
    }

    async findOne(id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOne({
            where: { reserva_id: id },
            relations: ['vehiculo', 'persona', 'usuario', 'pago']
        });

        if (!reserva) {
            throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
        }

        return reserva;
    }

    async update(id: number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
        // Cargar la reserva con la relación de vehículo y pagos
        const reserva = await this.reservaRepository.findOne({
            where: { reserva_id: id },
            relations: ['vehiculo', 'pago']
        });

        if (!reserva) {
            throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
        }

        // Verificar si hay superposición de fechas
        if (updateReservaDto.fecha_inicio || updateReservaDto.fecha_fin) {
            const fechaInicio = updateReservaDto.fecha_inicio || reserva.fecha_inicio;
            const fechaFin = updateReservaDto.fecha_fin || reserva.fecha_fin;
            const vehiculoId = updateReservaDto.vehiculo_id || (reserva.vehiculo ? reserva.vehiculo.vehiculo_id : null);

            if (!vehiculoId) {
                throw new Error('No se pudo determinar el vehículo para la validación de fechas');
            }

            const reservaExistente = await this.reservaRepository
                .createQueryBuilder('reserva')
                .where('reserva.vehiculo_id = :vehiculoId', { vehiculoId })
                .andWhere('reserva.estado_reserva IN (:...estados)', {
                    estados: [EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO]
                })
                .andWhere('reserva.reserva_id != :reservaId', { reservaId: id }) // Excluir la reserva actual
                .andWhere(
                    '(reserva.fecha_inicio <= :fechaFin AND reserva.fecha_fin >= :fechaInicio)',
                    { fechaInicio, fechaFin },
                )
                .getOne();

            if (reservaExistente) {
                throw new Error('Ya existe una reserva para este vehículo en las fechas seleccionadas');
            }
        }

        // Actualizar solo los campos proporcionados
        if (updateReservaDto.vehiculo_id) {
            // Si se está actualizando el vehículo, cargamos la relación
            const vehiculo = await this.vehiculoRepository.findOne({
                where: { vehiculo_id: updateReservaDto.vehiculo_id }
            });
            if (!vehiculo) {
                throw new NotFoundException(`Vehículo con ID ${updateReservaDto.vehiculo_id} no encontrado`);
            }
            reserva.vehiculo = vehiculo;
            delete updateReservaDto.vehiculo_id; // Eliminamos para evitar sobrescribir la relación
        }

        // Guardar fechas previas para calcular ajustes de pago
        const fechaInicioAnterior = reserva.fecha_inicio;
        const fechaFinAnterior = reserva.fecha_fin;

        // Actualizar el resto de campos
        Object.assign(reserva, updateReservaDto);

        const reservaActualizada = await this.reservaRepository.save(reserva);

        // Si cambió el rango de fechas, recalcular monto y ajustar el pago principal
        const fechasCambiarion = !!updateReservaDto.fecha_inicio || !!updateReservaDto.fecha_fin;
        if (fechasCambiarion && reservaActualizada.vehiculo) {
            const fechaInicioNueva = new Date(reservaActualizada.fecha_inicio);
            const fechaFinNueva = new Date(reservaActualizada.fecha_fin);

            const dias = Math.max(1, Math.ceil(
                (fechaFinNueva.getTime() - fechaInicioNueva.getTime()) / (1000 * 60 * 60 * 24)
            ));

            const nuevoMonto = dias * Number(reservaActualizada.vehiculo.precio);

            // Tomar el primer pago asociado como principal
            const pagoPrincipal = reserva.pago?.[0];
            if (pagoPrincipal) {
                const montoAnterior = Number(pagoPrincipal.monto);
                const ajuste = nuevoMonto - montoAnterior;

                await this.pagoRepository.update(pagoPrincipal.pago_id, {
                    monto: nuevoMonto.toFixed(2),
                    monto_ajuste: ajuste.toFixed(2),
                });
            }
        }

        // ✅ Actualizar estado del vehículo inmediatamente
        const vehiculoId = reserva.vehiculo?.vehiculo_id;
        if (vehiculoId) {
            const nuevoEstado = await this.vehicleScheduler.calcularEstado(vehiculoId);
            await this.vehiculoRepository.update(
                { vehiculo_id: vehiculoId },
                { estado_vehiculo: nuevoEstado }
            );
        }

        return reservaActualizada;
    }

    async remove(id: number): Promise<void> {
        const result = await this.reservaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
        }
    }

    // Método para cancelar una reserva (cambiar estado a inactivo)
    async cancel(id: number): Promise<Reserva> {
        const reserva = await this.findOne(id);

        if ([EstadoReserva.COMPLETADA, EstadoReserva.CANCELADA].includes(reserva.estado_reserva)) {
            throw new BadRequestException('No se puede cancelar una reserva en este estado');
        }

        reserva.estado_reserva = EstadoReserva.CANCELADA;

        const reservaCancelada = await this.reservaRepository.save(reserva);

        // ✅ Actualizar estado del vehículo inmediatamente
        const vehiculoId = reserva.vehiculo?.vehiculo_id;
        if (vehiculoId) {
            const nuevoEstado = await this.vehicleScheduler.calcularEstado(vehiculoId);
            await this.vehiculoRepository.update(
                { vehiculo_id: vehiculoId },
                { estado_vehiculo: nuevoEstado }
            );
        }

        return reservaCancelada;
    }

    // Método para obtener las reservas de un vehículo
    async findByVehiculo(vehiculoId: number): Promise<Reserva[]> {
        return await this.reservaRepository.find({
            where: { vehiculo: { vehiculo_id: vehiculoId } },
            relations: ['vehiculo', 'persona', 'usuario', 'pago'],
            order: { fecha_inicio: 'ASC' }
        });
    }

    // Método para obtener las reservas de un usuario
    async findByUsuario(usuarioId: number): Promise<Reserva[]> {
        return await this.reservaRepository.find({
            where: { usuario: { usuario_id: usuarioId } },
            relations: ['vehiculo', 'persona', 'usuario', 'pago'],
            order: { fecha_inicio: 'DESC' }
        });
    }
    async findByEstado(estado: EstadoReserva): Promise<Reserva[]> {
        return await this.reservaRepository.find({
            where: { estado_reserva: estado },
            relations: ['vehiculo', 'persona', 'usuario', 'pago'],
            order: { fecha_reserva: 'DESC' }
        });
    }
}
