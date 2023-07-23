import { Metadata } from '@grpc/grpc-js';
import { Inject, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  FindRequest,
  FindResponse,
  USER_V1ALPHA_PACKAGE_NAME,
  User,
} from 'src/stubs/user/v1alpha/message';
import { UserServiceClient } from 'src/stubs/user/v1alpha/service';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject(USER_V1ALPHA_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>(
      USER_V1ALPHA_PACKAGE_NAME,
    );
  }

  async findUser(req: FindRequest, metadata: Metadata): Promise<User> {
    const res: FindResponse = await firstValueFrom(
      this.userService.find(req, metadata),
    );

    return res.user?.[0];
  }
}
