import { Inject, Injectable } from "@nestjs/common";
import { Movie } from "../../domain/entities/movie.entity";
import { MovieRepository } from "../../domain/repositories/movie.repository";
import { CreateMovieDto } from "../dtos/create-movie.dto";

const MOVIE_REPOSITORY = "MOVIE_REPOSITORY";

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = new Movie(
      createMovieDto.year,
      createMovieDto.title,
      createMovieDto.studios,
      createMovieDto.producers,
      createMovieDto.winner
    );
    return this.movieRepository.create(movie);
  }

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.findAll();
  }
}
