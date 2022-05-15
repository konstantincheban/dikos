import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import mongoose from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Account {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Exclude()
  __v: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Exclude()
  userID: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  currency: string;

  @Prop()
  type: string;
}

export type AccountDocument = Account & Document;

export const AccountSchema = SchemaFactory.createForClass(Account);
