import { Metadata } from '@grpc/grpc-js';
import { Inject, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CAR_SERVICE_NAME, CarServiceClient } from 'src/stubs/car/service';
import { FindRequest, User } from 'src/stubs/user/v1alpha/message';

@Injectable()
export class CarService implements OnModuleInit {
  private carService: CarServiceClient;

  constructor(@Inject(CAR_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.carService =
      this.client.getService<CarServiceClient>(CAR_SERVICE_NAME);
  }

  async getCar(req: FindRequest, metadata: Metadata): Promise<User> {
    const res = await firstValueFrom(this.carService.getCar(req, metadata));

    return res.car;
  }
}
