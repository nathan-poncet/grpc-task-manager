import { Controller, Headers, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RaceService } from './race.service';
import {
  SubscribeRaceParticipationRequest,
  SubscribeRaceParticipationResponse,
  UnSubscribeRaceParticipationRequest,
  UnSubscribeRaceParticipationResponse,
} from '../stubs/race/request';
import { GrpcAuthGuard } from 'src/auth/auth.guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserService } from 'src/user/user.service';
import { CarService } from 'src/car/car.service';
import { GRPCUser } from 'src/auth/user.decorator';

@Controller('race')
export class RaceParticipationController {
  constructor(
    private raceService: RaceService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(CarService) private readonly carService: CarService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('RaceService')
  async subscribeRaceParticipation(
    @Payload() request: SubscribeRaceParticipationRequest,
    @Headers() headers,
    @GRPCUser() user,
  ): Promise<SubscribeRaceParticipationResponse> {
    try {
      // Verifiy user exists
      const fetchedUser = await this.userService.findUser(
        { id: user.id },
        headers,
      );

      if (!fetchedUser) {
        throw new RpcException({
          message: 'User not found',
          code: status.NOT_FOUND,
        });
      }

      // Verify car exists
      const fetchedCar = await this.carService.getCar({ id: request.carId });

      if (!fetchedCar) {
        throw new RpcException({
          message: 'Car not found',
          code: status.NOT_FOUND,
        });
      }

      // Verify car is owned by user
      if (fetchedCar.ownerId !== user.id) {
        throw new RpcException({
          message: 'Car not owned by user',
          code: status.PERMISSION_DENIED,
        });
      }

      const race = await this.raceService.subscribeRaceParticipation(
        request.id,
        request.carId,
      );

      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('RaceService')
  async unSubscribeRaceParticipation(
    @Payload() request: UnSubscribeRaceParticipationRequest,
    @Headers() headers,
    @GRPCUser() user,
  ): Promise<UnSubscribeRaceParticipationResponse> {
    try {
      // Verifiy user exists
      const fetchedUser = await this.userService.findUser(
        { id: user.id },
        headers,
      );

      if (!fetchedUser) {
        throw new RpcException({
          message: 'User not found',
          code: status.NOT_FOUND,
        });
      }

      // Verify car exists
      const fetchedCar = await this.carService.getCar({ id: request.carId });

      if (!fetchedCar) {
        throw new RpcException({
          message: 'Car not found',
          code: status.NOT_FOUND,
        });
      }

      // Verify car is owned by user
      if (fetchedCar.ownerId !== user.id) {
        throw new RpcException({
          message: 'Car not owned by user',
          code: status.PERMISSION_DENIED,
        });
      }

      const race = await this.raceService.unSubscribeRaceParticipation(
        request.id,
        request.carId,
      );

      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
