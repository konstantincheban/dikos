import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Exclude } from 'class-transformer';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false
})
export class Account extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Exclude()
  userID: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 'Custom Account' })
  description: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 'custom' })
  type: string;
}

export type AccountDocument = Account & Document;

export const AccountSchema = SchemaFactory.createForClass(Account);
