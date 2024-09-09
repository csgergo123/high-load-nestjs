import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { FastifyReply } from 'fastify';

@Controller()
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('jarmuvek')
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Res() res: FastifyReply,
  ) {
    try {
      const vehicle = await this.vehicleService.create(createVehicleDto);
      res
        .status(HttpStatus.CREATED)
        .header('Location', `/jarmuvek/${vehicle.uuid}`)
        .send();
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('kereses')
  async findByText(@Query('q') text: string, @Res() res: FastifyReply) {
    if (!text) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('A "q" paraméter kötelező.');
    }
    const vehicles = await this.vehicleService.findByText(text);
    res.status(HttpStatus.OK).send(vehicles);
  }

  @Get('jarmuvek/:uuid')
  async findByUuid(@Param('uuid') uuid: string, @Res() res: FastifyReply) {
    const vehicle = await this.vehicleService.findByUuid(uuid);
    if (vehicle) {
      res.status(HttpStatus.OK).send(vehicle);
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Get('jarmuvek')
  async countAll(@Res() res: FastifyReply) {
    const count = await this.vehicleService.countAll();
    res
      .status(HttpStatus.OK)
      .header('Content-Type', 'text/plain')
      .send(count.toString());
  }
}
