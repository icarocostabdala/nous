import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import csv from "csv-parser";
import { Readable } from "stream";
import { CreateMovieDto } from "../../application/dtos/create-movie.dto";
import { MoviesService } from "../../application/services/movies.service";

interface CsvRow {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner: string;
}

interface ProducerWin {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post("/upload-csv")
  @UseInterceptors(FileInterceptor("file"))
  async uploadCsv(@UploadedFile() file: any): Promise<any> {
    const results: CsvRow[] = [];
    const stream = Readable.from(file.buffer.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv({ separator: ";" }))
        .on("data", (data: CsvRow) => results.push(data))
        .on("end", async () => {
          try {
            for (const row of results) {
              const year = parseInt(row.year, 10);
              const title = row.title?.trim();
              const studios = row.studios?.trim();
              const producers = row.producers?.trim();
              const winner = row.winner
                ? row.winner.toLowerCase() === "yes"
                : false;

              if (isNaN(year) || !title || !studios || !producers) {
                throw new HttpException(
                  `Invalid data in row: ${JSON.stringify(row)}`,
                  HttpStatus.BAD_REQUEST
                );
              }

              const createMovieDto: CreateMovieDto = {
                year,
                title,
                studios,
                producers,
                winner,
              };

              await this.moviesService.create(createMovieDto);
            }
            resolve({ message: "CSV file processed successfully" });
          } catch (error: any) {
            reject(error); // Rejeita com o erro já tratado
          }
        })
        .on("error", (error: any) =>
          reject(
            new HttpException(
              "Internal server error",
              HttpStatus.INTERNAL_SERVER_ERROR
            )
          )
        );
    }).catch((error) => {
      throw error; // Lança o erro para ser capturado pelo NestJS
    });
  }

  @Get("/producers-intervals")
  async getProducersIntervals(): Promise<{
    min: ProducerWin[];
    max: ProducerWin[];
  }> {
    const movies = await this.moviesService.findAll();
    const producerWins: { [key: string]: number[] } = {};

    movies.forEach((movie: any) => {
      if (movie.winner) {
        movie.producers.split(",").forEach((producer: any) => {
          producer = producer.trim();
          if (!producerWins[producer]) {
            producerWins[producer] = [];
          }
          producerWins[producer].push(movie.year);
        });
      }
    });

    const intervals: ProducerWin[] = [];

    for (const producer in producerWins) {
      const wins = producerWins[producer].sort((a, b) => a - b);
      for (let i = 1; i < wins.length; i++) {
        intervals.push({
          producer,
          interval: wins[i] - wins[i - 1],
          previousWin: wins[i - 1],
          followingWin: wins[i],
        });
      }
    }

    const minInterval = Math.min(...intervals.map((i) => i.interval));
    const maxInterval = Math.max(...intervals.map((i) => i.interval));

    return {
      min: intervals.filter((i) => i.interval === minInterval),
      max: intervals.filter((i) => i.interval === maxInterval),
    };
  }
}
