import { Movie } from "../entities/movie.entity";

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;
  findAll(): Promise<Movie[]>;
}
