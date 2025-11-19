import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { Pago } from './entities/pago.entity';
import { Reserva } from 'src/reserva/entities/reserva.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Reserva, User])],
  controllers: [PagoController],
  providers: [PagoService],
})
export class PagoModule {}
