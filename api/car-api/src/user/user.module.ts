import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { userGrpcOptions } from 'src/config/grpc.option';
import { UserService } from './user.service';
import { USER_V1ALPHA_PACKAGE_NAME } from 'src/stubs/user/v1alpha/message';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: USER_V1ALPHA_PACKAGE_NAME,
        useFactory: (cs: ConfigService) => userGrpcOptions(cs),
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
