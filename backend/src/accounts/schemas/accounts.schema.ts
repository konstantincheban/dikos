import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import mongoose from 'mongoose';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Account {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userID: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  type: string;
}

export type AccountDocument = Account & Document;

export const AccountSchema = SchemaFactory.createForClass(Account);
