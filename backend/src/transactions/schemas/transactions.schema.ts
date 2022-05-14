import { User } from './../../users/schemas/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Account } from 'src/accounts/schemas/accounts.schema';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Transaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userID: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  accountID: Account;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop()
  category: string;

  @Prop()
  date: Date;

  @Prop()
  paymaster: string;
}

export type TransactionDocument = Transaction & Document;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
