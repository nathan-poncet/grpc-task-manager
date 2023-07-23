import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Schema as schema } from 'mongoose';

export type RaceDocument = HydratedDocument<Race>;

@Schema()
export class RaceParticipation {
  @Prop({ type: schema.Types.ObjectId })
  car_id: ObjectId;
}

@Schema()
export class Race {
  @Prop({ unique: true, index: true })
  name: string;

  @Prop([RaceParticipation])
  participations: IRaceParticipation[];

  @Prop()
  date: Date;
}

export type IRaceParticipation = {
  car_id: ObjectId;
};

const RaceSchema = SchemaFactory.createForClass(Race);

export { RaceSchema };
