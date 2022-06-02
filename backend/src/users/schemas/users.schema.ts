import { Budget } from '@budget/schemas/budget.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

@Schema()
export class User {
  @Exclude()
  _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Transform((value) => {
    if ('value' in value) {
      // HACK: this is changed because of https://github.com/typestack/class-transformer/issues/879
      // return value.value.toString(); // because "toString" is also a wrapper for "toHexString"
      return value.obj[value.key].toString();
    }

    return 'unknown value';
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' })
  budgetID: Budget;

  @Exclude()
  __v: number;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
