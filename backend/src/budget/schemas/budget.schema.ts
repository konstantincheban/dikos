import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import * as moment from 'moment';
import { AbstractDocument } from '@app/common';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class Budget extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Exclude()
  userID: string;

  @Prop({
    type: mongoose.Schema.Types.Array,
    default: [
      {
        date: moment().format('YYYY-MM'),
        amount: 0,
        plannedCosts: 0,
        perDay: 0,
      },
    ],
  })
  budgetsPerMonth: [
    {
      date: string;
      amount: number;
      plannedCosts: number;
      perDay: number;
    },
  ];
}

export type BudgetDocument = Budget & Document;

export const BudgetSchema = SchemaFactory.createForClass(Budget);
