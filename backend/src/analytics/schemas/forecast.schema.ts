import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import { ForecastTypes, Periods } from '../dto/forecast-dto';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class ForecastOptions {
  @Prop()
  startTime: string;

  @Prop({ type: String })
  period: Periods;

  @Prop()
  nTransactions: number;

  @Prop()
  modelVersion: string;

  @Prop({ type: String })
  forecastType: ForecastTypes;
}

@Schema({ versionKey: false })
export class ForecastResult {
  @Prop()
  dateTime: string;

  @Prop()
  amount: number;
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class Forecast extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Exclude()
  userID: string;

  @Prop({ required: true, default: [] })
  results: ForecastResult[];

  @Prop({ required: true })
  options: ForecastOptions;
}

export type ForecastDocument = Forecast & Document;

export const ForecastSchema = SchemaFactory.createForClass(Forecast);
