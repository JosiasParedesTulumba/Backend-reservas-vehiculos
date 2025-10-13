import { Module } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RolModule } from 'src/rol/rol.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona]),
    AuthModule,
    UserModule,
    RolModule,
  ],
  exports: [
    TypeOrmModule,
    PersonaService,
  ],
  controllers: [PersonaController],
  providers: [PersonaService],
})
export class PersonaModule {}
