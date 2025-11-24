import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('rol')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }

  @Get()
  @Roles('ADMIN', 'EMPLEADO')
  findAll() {
    return this.rolService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'EMPLEADO')
  findOne(@Param('id') id: string) {
    return this.rolService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto) {
    return this.rolService.update(+id, updateRolDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.rolService.remove(+id);
  }
}
