import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsString,
  IsNotEmpty,
  IsArray,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  rendszam: string;

  @ApiProperty({ example: 'Nagy Géza' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  tulajdonos: string;

  @ApiProperty({ example: '2026-06-20' })
  @IsDateString()
  @IsNotEmpty()
  forgalmi_ervenyes: string;

  @ApiProperty({ example: ['szín: kék', 'Alvázszám: 123'] })
  @IsArray()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(200, { each: true })
  adatok: string[];
}
