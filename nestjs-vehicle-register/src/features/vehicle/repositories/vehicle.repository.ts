import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class VehicleRepository {
  private logger = new Logger(VehicleRepository.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async onModuleInit() {
    await this.createIndex();
  }

  async createIndex() {
    try {
      // Ellenőrizzük, hogy létezik-e az index
      await this.redis.call('FT.INFO', 'vehicleIdx');
      this.logger.log('Index already exists, skipping creation.');
    } catch (error) {
      this.logger.log('Index does not exist, creating...');
      await this.redis.call(
        'FT.CREATE',
        'vehicleIdx',
        'ON',
        'HASH',
        'PREFIX',
        '1',
        'vehicle:',
        'SCHEMA',
        'uuid',
        'TEXT',
        'rendszam',
        'TEXT',
        'tulajdonos',
        'TEXT',
        'forgalmi_ervenyes',
        'TEXT',
        'adatok',
        'TEXT',
      );
      console.log('Index created successfully.');
    }
  }

  /** Create a new vehicle.
   *
   * @param createVehicleDto - DTO of the vehicle to create
   * @returns
   */
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const uuid = uuidv4();
    const key = `vehicle:${uuid}`;
    const vehicleData = {
      uuid: uuid,
      rendszam: createVehicleDto.rendszam,
      tulajdonos: createVehicleDto.tulajdonos,
      forgalmi_ervenyes: createVehicleDto.forgalmi_ervenyes,
      adatok: JSON.stringify(createVehicleDto.adatok),
    };

    try {
      await this.redis.hset(key, vehicleData);
      return {
        uuid,
        rendszam: createVehicleDto.rendszam,
        tulajdonos: createVehicleDto.tulajdonos,
        forgalmi_ervenyes: createVehicleDto.forgalmi_ervenyes,
        adatok: createVehicleDto.adatok,
      };
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
      return this.redis.dbsize();
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
      const records = await this.redis.hgetall(`vehicle:${uuid}`);
      const record =
        records && Object.keys(records).length > 0 ? records : null;
      return record
        ? {
            uuid: record.uuid,
            rendszam: record.rendszam,
            tulajdonos: record.tulajdonos,
            forgalmi_ervenyes: record.forgalmi_ervenyes,
            adatok: JSON.parse(record.adatok),
          }
        : null;
    } catch (error) {
      this.logger.error('Error finding vehicle by uuid', error);
      throw error;
    }
  }

  /** Find is rendszam occupied.
   *
   * @param rendszam - Rendszám of the vehicle
   * @returns
   */
  async isRendszamOccupied(rendszam: string): Promise<boolean> {
    // Kötőjel escape-elése. Duplán kell exceape-elni, mert az első a regex miatt kell.
    const escapedRendszam = rendszam.replace(/-/g, ' ');

    try {
      const rawRecords = (await this.redis.call(
        'FT.SEARCH',
        'vehicleIdx',
        `@rendszam:${escapedRendszam}`,
      )) as any[];

      if (rawRecords.length === 1) {
        return null;
      }

      return true;
    } catch (error) {
      this.logger.error('Error finding vehicle by rendszam', error);
      throw error;
    }
  }

  /** Find vehicles by text in rendszam, tulajdonos and adatok fields.
   *
   * @param text - Text to search for
   * @returns
   */
  async findByText(text: string): Promise<Vehicle[]> {
    try {
      this.logger.debug(`Searching for vehicles by text: ${text}`);

      // Kötőjel escape-elése. Duplán kell exceape-elni, mert az első a regex miatt kell.
      const escapedText = text.replace(/-/g, ' ');

      const rawRecords = (await this.redis.call(
        'FT.SEARCH',
        'vehicleIdx',
        escapedText,
      )) as any[];

      const vehicles: Vehicle[] = [];

      // Skip the first element (record count)
      for (let i = 1; i < rawRecords.length; i += 2) {
        const fields = rawRecords[i + 1];
        const vehicle: Partial<Vehicle> = {};

        // Iterate over the fields and map them to the Vehicle object
        for (let j = 0; j < fields.length; j += 2) {
          const fieldName = fields[j];
          const fieldValue = fields[j + 1];

          switch (fieldName) {
            case 'uuid':
              vehicle.uuid = fieldValue;
              break;
            case 'rendszam':
              vehicle.rendszam = fieldValue;
              break;
            case 'tulajdonos':
              vehicle.tulajdonos = fieldValue;
              break;
            case 'forgalmi_ervenyes':
              vehicle.forgalmi_ervenyes = fieldValue;
              break;
            case 'adatok':
              vehicle.adatok = JSON.parse(fieldValue); // Parse adatok as JSON
              break;
          }
        }

        // Add the vehicle to the results if all fields are valid
        vehicles.push(vehicle as Vehicle);
      }

      return vehicles;
    } catch (error) {
      this.logger.error('Error finding vehicle by text', error);
      throw error;
    }
  }
}
