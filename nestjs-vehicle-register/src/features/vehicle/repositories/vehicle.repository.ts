import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Vehicle } from '../entities/vehicle.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';

@Injectable()
export class VehicleRepository {
  private logger = new Logger(VehicleRepository.name);

  constructor(
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<Vehicle>,
  ) {}

  /** Create a new vehicle.
   *
   * @param createVehicleDto - DTO of the vehicle to create
   * @returns
   */
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      return this.vehicleModel.create(createVehicleDto);
    } catch (error) {
      this.logger.error('Error creating vehicle', error);
      throw error;
    }
  }

  /** Count all vehicles.
   *
   * @returns
   */
  async countAll(): Promise<number> {
    try {
      return await this.vehicleModel.countDocuments();
    } catch (error) {
      this.logger.error('Error counting vehicles', error);
      throw error;
    }
  }

  /** Find vehicle by uuid.
   *
   * @param uuid - UUID of the vehicle
   * @returns
   */
  async findByUuid(uuid: string): Promise<Vehicle> {
    try {
      return this.vehicleModel.findOne({ uuid }, { _id: 0 }).lean();
    } catch (error) {
      this.logger.error('Error finding vehicle by uuid', error);
      throw error;
    }
  }

  /** Find vehicle by rendszam.
   *
   * @param rendszam - Rendszám of the vehicle
   * @returns
   */
  async findByRendszam(rendszam: string): Promise<Vehicle | null> {
    return this.vehicleModel.findOne({ rendszam }, { _id: 0 }).lean();
  }

  /** Find vehicles by text in rendszam, tulajdonos and adatok fields.
   *
   * @param text - Text to search for
   * @returns
   */
  async findByText(text: string): Promise<Vehicle[]> {
    try {
      return this.vehicleModel
        .find(
          {
            $text: { $search: text },
          },
          { _id: 0 },
        )
        .lean();
    } catch (error) {
      this.logger.error('Error finding vehicle by text', error);
      throw error;
    }
  }

  /** Find vehicles by text in rendszam, tulajdonos and adatok fields.
   *
   * @param text - Text to search for
   * @returns
   */
  async findByTextCaseInsensitiveWithRegex(text: string): Promise<Vehicle[]> {
    try {
      // Case-insensitive keresés ékezetek megkülönböztetésével
      const regex = new RegExp(text, 'i'); // 'i' az insensitív kereséshez
      return await this.vehicleModel
        .find(
          {
            $or: [
              { rendszam: regex },
              { tulajdonos: regex },
              { adatok: regex },
            ],
          },
          { _id: 0 },
        )
        .lean();
    } catch (error) {
      this.logger.error('Error finding vehicle by text', error);
      throw error;
    }
  }
}
