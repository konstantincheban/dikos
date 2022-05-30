import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import mongoose from 'mongoose';
import { Exclude, Transform } from 'class-transformer';
import * as moment from 'moment';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Budget {
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Exclude()
  userID: User;

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

  @Exclude()
  __v: number;
}

export type BudgetDocument = Budget & Document;

export const BudgetSchema = SchemaFactory.createForClass(Budget);
