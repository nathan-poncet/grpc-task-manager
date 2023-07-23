import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { carGrpcOptions } from 'src/config/grpc.option';
import { CarService } from './car.service';
import { CAR_SERVICE_NAME } from 'src/stubs/car/service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: CAR_SERVICE_NAME,
        useFactory: (cs: ConfigService) => carGrpcOptions(cs),
      },
    ]),
  ],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
