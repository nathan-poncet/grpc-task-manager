import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Race, RaceSchema } from './entity/race.schema';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CarModule } from 'src/car/car.module';
import { RaceParticipationController } from './race.participation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Race.name, schema: RaceSchema }]),
    AuthModule,
    UserModule,
    CarModule,
  ],
  providers: [RaceService],
  controllers: [RaceController, RaceParticipationController],
})
export class RaceModule {}
