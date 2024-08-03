import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class CoinHistory {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
    index: true,
  })
  code: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  exchanges: number;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  markets: number;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  pairs: number;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  allTimeHighUSD: number;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  circulatingSupply: number;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  totalSupply: number;

  @Prop({ type: mongoose.Schema.Types.Number, default: null })
  maxSupply: number | null;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  rate: number;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  volume: number;

  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  cap: number;

  @Prop(
    raw({
      hour: { type: Number },
      day: { type: Number },
      week: { type: Number },
      month: { type: Number },
      quarter: { type: Number },
      year: { type: Number },
    }),
  )
  delta: Record<string, number>;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
  })
  createdAt: Date;
}

export const CoinHistorySchema = SchemaFactory.createForClass(CoinHistory);

export type CoinHistoryDocument = HydratedDocument<CoinHistory>;
