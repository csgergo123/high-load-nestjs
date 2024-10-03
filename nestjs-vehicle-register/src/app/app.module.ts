import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
// import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { DatabaseModule } from 'src/cores/database/database.module';
import { VehicleModule } from 'src/features/vehicle/vehicle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    }),
    DatabaseModule,
    VehicleModule,
  ],
})
export class AppModule {
  //   configure(consumer: MiddlewareConsumer) {
  //     consumer
  //       .apply(LoggerMiddleware)
  //       .forRoutes({ path: '*', method: RequestMethod.ALL });
  //   }
}
