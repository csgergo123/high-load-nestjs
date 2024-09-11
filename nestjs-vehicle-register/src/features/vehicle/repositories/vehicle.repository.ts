import { Injectable, Logger } from '@nestjs/common';
import { Vehicle } from '../entities/vehicle.entity';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/cores/prisma/services/prisma.service';

@Injectable()
export class VehicleRepository {
  private logger = new Logger(VehicleRepository.name);

  constructor(private prisma: PrismaService) {}

  /** Create a new vehicle.
   *
   * @param createVehicleDto - DTO of the vehicle to create
   * @returns
   */
  async create(createVehicleDto: Prisma.VehicleCreateInput): Promise<Vehicle> {
    try {
      return this.prisma.vehicle.create({
        data: createVehicleDto,
      });
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
      return await this.prisma.vehicle.count();
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
      return this.prisma.vehicle.findUnique({
        where: { uuid },
      });
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
    try {
      return this.prisma.vehicle.findUnique({
        where: { rendszam },
      });
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
      return this.prisma.vehicle.findMany({
        where: {
          OR: [
            {
              rendszam: {
                contains: text,
                mode: 'insensitive',
              },
            },
            {
              tulajdonos: {
                contains: text,
                mode: 'insensitive',
              },
            },
            {
              adatok: {
                hasSome: [text],
              },
            },
          ],
        },
      });
    } catch (error) {
      this.logger.error('Error finding vehicle by text', error);
      throw error;
    }
  }

  async findByTextWithPlainSQL(text: string): Promise<Vehicle[]> {
    try {
      const searchText = `%${text.toLowerCase()}%`;
      return await this.prisma.$queryRaw<Vehicle[]>`
        SELECT * FROM "Vehicle"
        WHERE "rendszam" ILIKE ${searchText}
        OR "tulajdonos" ILIKE ${searchText}
        OR EXISTS (
          SELECT 1 FROM unnest("adatok") AS x
          WHERE x ILIKE ${searchText}
        );
      `;
    } catch (error) {
      this.logger.error('Error finding vehicles by text', error);
      throw error;
    }
  }
}
