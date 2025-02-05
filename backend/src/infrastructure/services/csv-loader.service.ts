import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import csv from "csv-parser";
import * as fs from "fs";
import * as path from "path";
import { Movie } from "../../domain/entities/movie.entity";
import { MovieRepository } from "../../domain/repositories/movie.repository";

const MOVIE_REPOSITORY = "MOVIE_REPOSITORY";

@Injectable()
export class CsvLoaderService implements OnApplicationBootstrap {
  constructor(
    @Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository
  ) {}

  async onApplicationBootstrap() {
    await this.loadCsv();
  }

  private async loadCsv() {
    const results: Movie[] = [];

    const csvFilePath = path.resolve(process.cwd(), "data/movielist.csv");

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => {
        data.winner = data.winner?.trim().toLowerCase() === "yes";

        results.push(data);
      })
      .on("end", async () => {
        try {
          await this.movieRepository.insertMany(results);
          console.log(
            "Arquivo CSV processado com sucesso e dados salvos no nousdb"
          );
        } catch (error) {
          console.error("Error saving data to MongoDB", error);
        }
      });
  }
}
