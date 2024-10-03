import { Response } from 'express';
import { Cache } from 'cache-manager';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  Query,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Vehicle } from '../entities/vehicle.entity';

@Controller()
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('jarmuvek')
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Res() res: Response,
  ) {
    try {
      const vehicle = await this.vehicleService.create(createVehicleDto);
      // Store the vehicle in the cache
      await this.cacheManager.set(vehicle.uuid, vehicle, 1600);
      res.status(201).header('Location', `/jarmuvek/${vehicle.uuid}`).send();
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: error.message });
    }
  }

  @Get('kereses')
  async findByText(@Query('q') text: string, @Res() res: Response) {
    if (!text) {
      return res.status(400).send('A "q" paraméter kötelező.');
    }
    const vehicles = await this.vehicleService.findByText(text);
    res.status(200).send(vehicles);
  }

  @Get('jarmuvek/:uuid')
  async findByUuid(@Param('uuid') uuid: string, @Res() res: Response) {
    // Find vehicle by UUID in cache
    const cachedVehicle = await this.cacheManager.get<Vehicle>(uuid);
    if (cachedVehicle) {
      return res.status(200).send(cachedVehicle);
    } else {
      res.status(404).send();
    }

    // const vehicle = await this.vehicleService.findByUuid(uuid);
    // if (vehicle) {
    //   res.status(200).send(vehicle);
    // } else {
    //   res.status(404).send();
    // }
  }

  @Get('jarmuvek')
  async countAll(@Res() res: Response) {
    const count = await this.vehicleService.countAll();
    res.status(200).header('Content-Type', 'text/plain').send(count.toString());
  }
}
