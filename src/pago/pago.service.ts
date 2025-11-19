import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';
import { Reserva } from 'src/reserva/entities/reserva.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago) private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Reserva) private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async create(createPagoDto: CreatePagoDto) {
    // Cargar la reserva CON todas sus relaciones
    const reserva = await this.reservaRepository.findOne({
      where: { reserva_id: createPagoDto.reserva_id },
      relations: ['persona', 'vehiculo', 'usuario'] // IMPORTANTE: Cargar relaciones
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    const usuario = await this.userRepository.findOne({ where: { usuario_id: createPagoDto.usuario_id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const nuevo = this.pagoRepository.create({
      reserva,
      usuario,
      fecha_pago: new Date(createPagoDto.fecha_pago),
      monto: createPagoDto.monto,
      metodo_pago: createPagoDto.metodo_pago,
      estado_pago: createPagoDto.estado_pago,
      monto_ajuste: createPagoDto.monto_ajuste ?? '0',
    });

    const pagoGuardado = await this.pagoRepository.save(nuevo);

    // Retornar el pago con todas las relaciones cargadas
    return await this.pagoRepository.findOne({
      where: { pago_id: pagoGuardado.pago_id },
      relations: ['reserva', 'reserva.persona', 'reserva.vehiculo', 'reserva.usuario', 'usuario']
    });
  }

  async findAll() {
    // CRÍTICO: Cargar TODAS las relaciones anidadas
    return await this.pagoRepository.find({
      relations: [
        'reserva',              
        'reserva.persona',      
        'reserva.vehiculo',     
        'reserva.usuario',      
        'usuario'              
      ],
      order: {
        fecha_pago: 'DESC'
      }
    });
  }

  async findOne(id: number) {
    const pago = await this.pagoRepository.findOne({
      where: { pago_id: id },
      relations: [
        'reserva',
        'reserva.persona',
        'reserva.vehiculo',
        'reserva.usuario',
        'usuario'
      ]
    });
    if (!pago) throw new NotFoundException('Pago no encontrado');
    return pago;
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    const pago = await this.pagoRepository.findOne({
      where: { pago_id: id },
      relations: ['reserva', 'reserva.persona', 'reserva.vehiculo', 'usuario']
    });
    if (!pago) throw new NotFoundException('Pago no encontrado');

    if (updatePagoDto.reserva_id) {
      const reserva = await this.reservaRepository.findOne({
        where: { reserva_id: updatePagoDto.reserva_id },
        relations: ['persona', 'vehiculo', 'usuario']
      });
      if (!reserva) throw new NotFoundException('Reserva no encontrada');
      pago.reserva = reserva;
    }
    if (updatePagoDto.usuario_id) {
      const usuario = await this.userRepository.findOne({ where: { usuario_id: updatePagoDto.usuario_id } });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
      pago.usuario = usuario;
    }
    if (updatePagoDto.fecha_pago) pago.fecha_pago = new Date(updatePagoDto.fecha_pago);
    if (updatePagoDto.monto !== undefined) pago.monto = updatePagoDto.monto;
    if (updatePagoDto.metodo_pago !== undefined) pago.metodo_pago = updatePagoDto.metodo_pago;
    if (updatePagoDto.estado_pago !== undefined) pago.estado_pago = updatePagoDto.estado_pago;
    if (updatePagoDto.monto_ajuste !== undefined) pago.monto_ajuste = updatePagoDto.monto_ajuste;

    const pagoActualizado = await this.pagoRepository.save(pago);

    // Retornar con todas las relaciones
    return await this.pagoRepository.findOne({
      where: { pago_id: pagoActualizado.pago_id },
      relations: ['reserva', 'reserva.persona', 'reserva.vehiculo', 'reserva.usuario', 'usuario']
    });
  }

  async remove(id: number) {
    const pago = await this.pagoRepository.findOne({ where: { pago_id: id } });
    if (!pago) throw new NotFoundException('Pago no encontrado');
    await this.pagoRepository.delete(id);
    return { deleted: true };
  }
}
