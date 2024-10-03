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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  rendszam: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  tulajdonos: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  forgalmi_ervenyes: string;

  @ApiProperty()
  @IsArray()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(200, { each: true })
  adatok: string[];
}
