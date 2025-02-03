import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie } from "../../domain/entities/movie.entity";
import { MovieRepository } from "../../domain/repositories/movie.repository";
import { MovieDocument } from "../schemas/movie.schema";

export class MovieRepositoryImpl implements MovieRepository {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>
  ) {}

  async create(movie: Movie): Promise<Movie> {
    const createdMovie = new this.movieModel(movie);
    return createdMovie.save();
  }

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }
}
