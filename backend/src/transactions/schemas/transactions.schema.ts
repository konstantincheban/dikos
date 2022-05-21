import { User } from './../../users/schemas/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Account } from 'src/accounts/schemas/accounts.schema';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

import { Exclude } from 'class-transformer';

@Schema()
export class Transaction {
  @Exclude()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userID: User;

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
