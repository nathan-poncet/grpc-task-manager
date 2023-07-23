import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Race, RaceDocument } from './entity/race.schema';
import { CreateRaceDto, UpdateRaceDto } from './entity/race.dto';
import { Race as RacePb } from '../stubs/race/message';
import { ObjectId } from 'mongodb';
@Injectable()
export class RaceService {
  constructor(@InjectModel(Race.name) private raceModel: Model<RaceDocument>) {}

  toRacePb(race: Partial<RaceDocument>): RacePb {
    return {
      id: race._id.toString(),
      name: race.name,
      date: race.date.toISOString(),
      participations: race.participations.map((p) => ({
        carId: p.car_id.toString(),
      })),
    };
  }

  async create(createRaceDto: CreateRaceDto): Promise<Race> {
    try {
      const createdRace = new this.raceModel(createRaceDto);
      return await createdRace.save();
    } catch (error) {
      if ((error?.message as string)?.includes('E11000')) {
        throw new Error(`${createRaceDto.name} name is taken`);
      }
    }
  }

  async findAll(): Promise<Race[]> {
    return this.raceModel.find().exec();
  }

  async find(id: string | number, name: string) {
    const race = await this.raceModel.findOne({ id, name });

    if (!race) {
      throw new Error(`race with id ${id} or name ${name} not found`);
    }

    return race;
  }

  async subscribeRaceParticipation(id: string, carId: string) {
    const race = await this.find(id, '');

    // Check if car is already subscribed
    if (race.participations.some((p) => p.car_id.equals(carId))) {
      throw new Error('Car is already subscribed');
    }

    race.participations = [
      ...race.participations,
      { car_id: new ObjectId(carId) },
    ];

    await race.save();

    return race;
  }

  async unSubscribeRaceParticipation(id: string, carId: string) {
    const race = await this.find(id, '');

    race.participations = race.participations.filter((participation) =>
      participation.car_id.equals(carId),
    );

    await race.save();

    return race;
  }

  async updateRace(
    { id, name }: { id?: string; name?: string },
    uRace: UpdateRaceDto,
  ): Promise<Race> {
    let race: RaceDocument;
    if (id) {
      race = await this.raceModel.findById(id);
    } else {
      race = await this.raceModel.findOne({ name });
    }

    if (!race) {
      throw new Error(`race with id ${id} or name ${name} not found`);
    }

    Object.assign(race, uRace);

    await race.save();
    return race;
  }

  async deleteRace(id: number | string) {
    const race = await this.raceModel.findOneAndDelete({
      id,
    });

    if (!race) {
      throw new Error(`race with id ${id} not found`);
    }

    return race;
  }
}
