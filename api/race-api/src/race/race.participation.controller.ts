import { Controller, Header, Headers, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RaceService } from './race.service';
import {
  DeleteRaceRequest,
  CreateRaceRequest,
  GetRaceRequest,
  ListRacesResponse,
  GetRaceResponse,
  CreateRaceResponse,
  DeleteRaceResponse,
  UpdateRaceRequest,
  UpdateRaceResponse,
  SubscribeRaceParticipationRequest,
  SubscribeRaceParticipationResponse,
} from '../stubs/race/request';
import { GrpcAuthGuard } from 'src/auth/auth.guard';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRaceDto } from './entity/race.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Roles } from 'src/auth/role.decorator';
import { UserRole } from 'src/stubs/user/v1alpha/message';
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

      const race = await this.raceService.subscribeRaceParticipation(
        request.id,
        request.name,
      );

      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('RaceService')
  async ListRaces(): Promise<ListRacesResponse> {
    try {
      const races = await this.raceService.findAll();

      return { races: races.map(this.raceService.toRacePb), nextPageToken: '' };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @UseGuards(GrpcAuthGuard)
  @Roles(UserRole.USER_ROLE_ADMIN)
  @GrpcMethod('RaceService')
  async CreateRace(request: CreateRaceRequest): Promise<CreateRaceResponse> {
    try {
      await this.validateDto(request, CreateRaceDto);
      const nRace = {
        name: request.name,
        date: new Date(request.date),
      };

      const race = await this.raceService.create(nRace);
      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @UseGuards(GrpcAuthGuard)
  @Roles(UserRole.USER_ROLE_ADMIN)
  @GrpcMethod('RaceService')
  async UpdateRace(request: UpdateRaceRequest): Promise<UpdateRaceResponse> {
    try {
      const nRace = {
        name: request.name,
        date: new Date(request.date),
      };

      const race = await this.raceService.updateRace({ id: request.id }, nRace);
      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);

      throw new RpcException(error);
    }
  }

  @UseGuards(GrpcAuthGuard)
  @Roles(UserRole.USER_ROLE_ADMIN)
  @GrpcMethod('RaceService')
  async DeleteRace(request: DeleteRaceRequest): Promise<DeleteRaceResponse> {
    try {
      const race = await this.raceService.deleteRace(request.id);
      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);

      throw new RpcException(error);
    }
  }

  private async validateDto(data: any, Dto: any) {
    if (!data) {
      throw new RpcException({
        message: 'No data provided',
        code: status.INVALID_ARGUMENT,
      });
    }
    const dto = plainToInstance(Dto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: errors
          .map(
            ({ value, property, constraints }) =>
              `${value} is not a valid ${property} value (${Object.values(
                constraints,
              ).join(', ')})`,
          )
          .join('\n'),
      });
    }
  }
}
