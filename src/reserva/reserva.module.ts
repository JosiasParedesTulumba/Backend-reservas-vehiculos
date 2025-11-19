import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';
import { Persona } from 'src/persona/entities/persona.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, Vehiculo, Persona, User]),
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
