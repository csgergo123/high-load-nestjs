import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { VehicleRepository } from '../repositories/vehicle.repository';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return this.vehicleRepository.create(createVehicleDto);
  }

  countAll() {
    return this.vehicleRepository.countAll();
  }

  findByUuid(id: string) {
    return this.vehicleRepository.findByUuid(id);
  }

  findByText(text: string) {
    return this.vehicleRepository.findByTextCaseInsensitiveWithRegex(text);
  }
}
