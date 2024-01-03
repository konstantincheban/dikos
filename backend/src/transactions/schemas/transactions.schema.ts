import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Exclude, Transform } from 'class-transformer';
import { AbstractDocument } from '@app/common';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class Transaction extends AbstractDocument {
  @Exclude()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userID: string;

  @Transform((value) => {
    if ('value' in value) {
      // HACK: this is changed because of https://github.com/typestack/class-transformer/issues/879
      // return value.value.toString(); // because "toString" is also a wrapper for "toHexString"
      return value.obj[value.key].toString();
    }

    return 'unknown value';
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  accountID: string;

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
}

export type TransactionDocument = Transaction & Document;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
