import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Coin {
  @Prop({ required: true, type: mongoose.Schema.Types.String })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
    unique: true,
    index: true,
  })
  code: string;

  @Prop({ type: mongoose.Schema.Types.String, default: null })
  symbol: string | null;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  age: number;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  png64: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: new Date(),
  })
  createdAt: Date;
}

export const CoinSchema = SchemaFactory.createForClass(Coin);

export type CoinDocument = HydratedDocument<Coin>;
