import { FastifyReply } from 'fastify';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Query,
  Inject,
  Logger,
} from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';

@Controller()
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  private logger = new Logger(VehicleController.name);

  @Post('jarmuvek')
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Res() res: FastifyReply,
  ) {
    try {
      const vehicle = await this.vehicleService.create(createVehicleDto);
      res.status(201).header('Location', `/jarmuvek/${vehicle.uuid}`).send();
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }

  @Get('kereses')
  async findByText(@Query('q') text: string, @Res() res: FastifyReply) {
    if (!text) {
      return res.status(400).send('A "q" paraméter kötelező.');
    }
    const vehicles = await this.vehicleService.findByText(text);
    res.status(200).send(vehicles);
  }

  @Get('jarmuvek/:uuid')
  async findByUuid(@Param('uuid') uuid: string, @Res() res: FastifyReply) {
    const vehicle = await this.vehicleService.findByUuid(uuid);
    if (vehicle) {
      res.status(200).send(vehicle);
    } else {
      res.status(404).send();
    }
  }

  @Get('jarmuvek')
  async countAll(@Res() res: FastifyReply) {
    const count = await this.vehicleService.countAll();
    res.status(200).header('Content-Type', 'text/plain').send(count.toString());
  }
}
