import { User } from './../../users/schemas/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Account } from 'src/accounts/schemas/accounts.schema';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

import { Exclude, Transform } from 'class-transformer';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Transaction {
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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userID: User;

  @Transform((value) => {
    if ('value' in value) {
      // HACK: this is changed because of https://github.com/typestack/class-transformer/issues/879
      // return value.value.toString(); // because "toString" is also a wrapper for "toHexString"
      return value.obj[value.key].toString();
    }

    return 'unknown value';
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  accountID: Account;

  @Prop({ default: 'Transaction Name' })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 'default' })
  category: string;

  @Prop({ default: new Date() })
  date: Date;

  @Prop({ default: 'default' })
  paymaster: string;

  @Exclude()
  __v: number;
}

export type TransactionDocument = Transaction & Document;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
