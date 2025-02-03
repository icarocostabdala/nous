import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  uri: process.env.MONGO_URI ?? "mongodb://nous-mongo:27017/nousdb",
}));
