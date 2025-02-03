import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MoviesService } from "./application/services/movies.service";
import databaseConfig from "./configuration";
import { MongoProvider } from "./infrastructure/database/mongo.provider";
import { MovieRepositoryImpl } from "./infrastructure/repositories/movie.repository.impl";
import { Movie, MovieSchema } from "./infrastructure/schemas/movie.schema";
import { MoviesController } from "./presentation/controllers/movies.controller";

const MOVIE_REPOSITORY = "MOVIE_REPOSITORY";

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
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    MongoProvider,
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    { provide: MOVIE_REPOSITORY, useClass: MovieRepositoryImpl },
  ],
})
export class AppModule {}
