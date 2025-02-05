import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  year!: number;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  studios!: string;

  @Prop({ required: true })
  producers!: string;

  @Prop({ required: true })
  winner!: boolean;
}

export type MovieDocument = Movie & Document;
export const MovieSchema = SchemaFactory.createForClass(Movie);
