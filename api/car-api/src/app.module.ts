import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption from './config/grpc.option';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import winstonConfig from './config/winston.config';
import { CarModule } from './car/car.module';
import { UserModule } from './user/user.module';

const envSchema = Joi.object({
  MONGO_URL: Joi.string().required(),
  PORT: Joi.string().default(4002),
  HEALTH_PORT: Joi.number().default(3000),
  insecure: Joi.boolean().required(),
  CAR_CERT: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  CAR_KEY: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  ROOT_CA: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  JAEGER_URL: Joi.string().required(),
  AUTH_API_URL: Joi.string().required(),
  USER_API_URL: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: envSchema,
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => winstonConfig(cs),
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    AuthModule,
    UserModule,
    HealthModule,
    CarModule,
  ],
})
export class AppModule {}
