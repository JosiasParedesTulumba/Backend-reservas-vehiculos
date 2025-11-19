import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { IsDecimal } from 'class-validator';

export class CreatePagoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  reserva_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  usuario_id: number;

  @IsDateString()
  fecha_pago: string;

  // Use decimal as string to avoid JS float precision issues
  @IsDecimal({ decimal_digits: '1,2' })
  monto: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  metodo_pago: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  estado_pago: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  monto_ajuste?: string;
}
