import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { User } from '@users/schemas/users.schema';
import mongoose from 'mongoose';
import { Exclude, Transform } from 'class-transformer';
import { ForecastTypes, Periods } from '../dto/forecast-dto';

@Schema()
export class ForecastOptions {
  @Prop()
  startTime: string;

  @Prop()
  period: Periods;

  @Prop()
  nTransactions: number;

  @Prop()
  modelVersion: string;

  @Prop()
  forecastType: ForecastTypes;
}

@Schema()
export class ForecastResult {
  @Prop()
  dateTime: string;

  @Prop()
  amount: number;
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Forecast {
  // makes sure that when deserializing from a Mongoose Object, ObjectId is serialized into a string
  @Transform((value) => {
    if ('value' in value) {
      // HACK: this is changed because of https://github.com/typestack/class-transformer/issues/879
      // return value.value.toString(); // because "toString" is also a wrapper for "toHexString"
      return value.obj[value.key].toString();
    }

    return 'unknown value';
  })
  _id: string;

  @Exclude()
  __v: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Exclude()
  userID: User;

  @Prop({ required: true, default: [] })
  results: ForecastResult[];

  @Prop({ required: true })
  options: ForecastOptions;
}

export type ForecastDocument = Forecast & Document;

export const ForecastSchema = SchemaFactory.createForClass(Forecast);
