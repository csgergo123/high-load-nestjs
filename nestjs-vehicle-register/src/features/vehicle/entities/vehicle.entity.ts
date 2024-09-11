import { ApiProperty } from '@nestjs/swagger';

export class Vehicle {
  uuid: string;

  @ApiProperty()
  rendszam: string;

  @ApiProperty()
  tulajdonos: string;

  @ApiProperty()
  forgalmi_ervenyes: string;

  @ApiProperty()
  adatok: string[];
}
