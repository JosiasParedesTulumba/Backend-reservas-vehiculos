import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('pago')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PagoController {
  
  constructor(private readonly pagoService: PagoService) {}

  @Post()
  @Roles('ADMIN', 'EMPLEADO')
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(createPagoDto);
  }

  @Get()
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findAll() {
    return this.pagoService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'EMPLEADO', 'SUPERVISOR')
  findOne(@Param('id') id: string) {
    return this.pagoService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'EMPLEADO')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }
}
