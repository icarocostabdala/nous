// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MoviesService } from "./application/services/movies.service";
import databaseConfig from "./configuration";
import { MongoProvider } from "./infrastructure/database/mongo.provider";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { MoviesController } from "./presentation/controllers/movies.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("database.uri"),
      }),
      inject: [ConfigService],
    }),
    InfrastructureModule,
    MongoProvider,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class AppModule {}
