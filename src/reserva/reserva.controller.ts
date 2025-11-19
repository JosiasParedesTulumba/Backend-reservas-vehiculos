import { Controller, Get, Post, Body, Param, Delete, Req, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reserva')
export class ReservaController {

  constructor(private readonly reservaService: ReservaService) { }
  
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createReservaDto: CreateReservaDto, @Req() req: any) {
    return this.reservaService.create(createReservaDto, req.user.usuario_id);
  }

  @Get()
  async findAll() {
    return this.reservaService.findAll();
  }

  @Get('vehiculo/:vehiculoId')
  async findByVehiculo(@Param('vehiculoId', ParseIntPipe) vehiculoId: number) {
    return this.reservaService.findByVehiculo(vehiculoId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservaService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservaService.update(id, updateReservaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservaService.remove(id);
  }

  @Post(':id/cancelar')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservaService.cancel(id);
  }
}
