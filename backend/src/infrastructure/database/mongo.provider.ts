import { MongooseModule } from "@nestjs/mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export const MongoProvider = MongooseModule.forFeature([
  { name: "User", schema: UserSchema },
]);
