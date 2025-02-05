import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MovieRepositoryImpl } from "./repositories/movie.repository.impl";
import { Movie, MovieSchema } from "./schemas/movie.schema";
import { CsvLoaderService } from "./services/csv-loader.service";

const MOVIE_REPOSITORY = "MOVIE_REPOSITORY";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  providers: [
    CsvLoaderService,
    {
      provide: MOVIE_REPOSITORY,
      useClass: MovieRepositoryImpl,
    },
  ],
  exports: [CsvLoaderService, MOVIE_REPOSITORY],
})
export class InfrastructureModule {}
