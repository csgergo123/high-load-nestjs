import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { VehicleModule } from 'src/features/vehicle/vehicle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
