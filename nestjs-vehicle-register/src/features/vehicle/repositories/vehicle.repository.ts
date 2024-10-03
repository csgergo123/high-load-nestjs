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
      if (error.message.includes('Unknown Index name')) {
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
      } else {
        throw error;
      }
    }
  }

  /** Create a new vehicle.
   *
   * @param createVehicleDto - DTO of the vehicle to create
   * @returns
   */
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const uuid = uuidv4();
    try {
      const key = `vehicle:${uuid}`;
      await this.redis.hset(
        key,
        'uuid',
        uuid,
        'rendszam',
        createVehicleDto.rendszam,
        'tulajdonos',
        createVehicleDto.tulajdonos,
        'forgalmi_ervenyes',
        createVehicleDto.forgalmi_ervenyes,
        'adatok',
        JSON.stringify(createVehicleDto.adatok),
      );
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

  /** Find vehicle by rendszam.
   *
   * @param rendszam - Rendszám of the vehicle
   * @returns
   */
  async findByRendszam(rendszam: string): Promise<Vehicle | null> {
    throw new Error('Method not implemented.');
  }

  /** Find vehicles by text in rendszam, tulajdonos and adatok fields.
   *
   * @param text - Text to search for
   * @returns
   */
  async findByText(text: string): Promise<Vehicle[]> {
    try {
      this.logger.debug(`Searching for vehicles by text: ${text}`);

      const rawRecords = (await this.redis.call(
        'FT.SEARCH',
        'vehicleIdx',
        text,
      )) as any[];

      this.logger.debug(`Found ${rawRecords.length} vehicles`, rawRecords);

      const vehicles: Vehicle[] = [];

      // Skip the first element (record count), process the results
      for (let i = 1; i < rawRecords.length; i += 2) {
        const fields = rawRecords[i + 1];
        console.log('🚀 ~ VehicleRepository ~ findByText ~ fields:', fields);

        // Mapping fields into Vehicle object
        const vehicle: Vehicle = {
          uuid: fields[1],
          rendszam: fields[3],
          tulajdonos: fields[5],
          forgalmi_ervenyes: fields[7],
          adatok: JSON.parse(fields[9]),
        };

        vehicles.push(vehicle);
      }

      return vehicles;
    } catch (error) {
      this.logger.error('Error finding vehicle by text', error);
      throw error;
    }
  }
}
