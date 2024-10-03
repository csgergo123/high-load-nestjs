import { Module } from '@nestjs/common';
import { VehicleService } from './services/vehicle.service';
import { VehicleController } from './controllers/vehicle.controller';
import { VehicleRepository } from './repositories/vehicle.repository';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
      // url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
  ],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleRepository],
})
export class VehicleModule {}
