import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findByUsername(nombre_usuario: string) {
    return await this.userRepository.findOne({
      where: { nombre_usuario, estado_usuario: 1 },
      relations: ['rol', 'persona'],
    });
  }

  async findOne(usuario_id: number) {
    const usuario = await this.userRepository.findOne({
      where: { usuario_id },
      relations: ['rol', 'persona'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async create(createUserDto: CreateUserDto) {
    // Verificar que no existe el nombre de usuario
    const existeUsuario = await this.userRepository.findOne({
      where: { nombre_usuario: createUserDto.nombre_usuario }
    });

    if (existeUsuario) {
      throw new BadRequestException('El nombre de usuario ya existe');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, salt);

    const usuario = this.userRepository.create({
      ...createUserDto,
      contrasena: hashedPassword,
      estado_usuario: 1, // Por defecto activo
    });

    return await this.userRepository.save(usuario);
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['rol', 'persona'],
      where: { estado_usuario: 1 }, // Solo usuarios activos
      order: { usuario_id: 'ASC' }
    });
  }

  async update(usuario_id: number, updateUserDto: UpdateUserDto) {
    const usuario = await this.findOne(usuario_id);

    // Si se cambia nombre de usuario, verificar que no exista
    if (updateUserDto.nombre_usuario) {
      const existeUsuario = await this.userRepository.findOne({
        where: {
          nombre_usuario: updateUserDto.nombre_usuario,
          usuario_id: Not(usuario_id) // Excluir el usuario actual
        }
      });

      if (existeUsuario) {
        throw new BadRequestException('El nombre de usuario ya existe');
      }
    }

    if (updateUserDto.contrasena) {
      const salt = await bcrypt.genSalt();
      updateUserDto.contrasena = await bcrypt.hash(updateUserDto.contrasena, salt);
    }

    await this.userRepository.update(usuario_id, updateUserDto);
    return this.findOne(usuario_id);
  }

  async remove(usuario_id: number) {
    const usuario = await this.findOne(usuario_id);
    // Soft delete - cambiar estado a 0
    await this.userRepository.update(usuario_id, { estado_usuario: 0 });
    return { message: 'Usuario desactivado correctamente' };
  }
}
