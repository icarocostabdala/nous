import { Test, TestingModule } from "@nestjs/testing";
import { Movie } from "../../domain/entities/movie.entity";
import { MovieRepository } from "../../domain/repositories/movie.repository";
import { CreateMovieDto } from "../dtos/create-movie.dto";
import { MoviesService } from "./movies.service";

describe("MoviesService", () => {
  let service: MoviesService;
  let repository: MovieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: "MOVIE_REPOSITORY",
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<MovieRepository>("MOVIE_REPOSITORY");
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new movie", async () => {
      const createMovieDto: CreateMovieDto = {
        year: 2010,
        title: "Inception",
        studios: "Warner Bros.",
        producers: "Emma Thomas, Christopher Nolan",
        winner: true,
      };

      const movie = new Movie(
        createMovieDto.year,
        createMovieDto.title,
        createMovieDto.studios,
        createMovieDto.producers,
        createMovieDto.winner
      );

      jest.spyOn(repository, "create").mockResolvedValue(movie);

      const result = await service.create(createMovieDto);

      expect(result).toEqual(movie);
      expect(repository.create).toHaveBeenCalledWith(movie);
    });
  });

  describe("findAll", () => {
    it("should return an array of movies", async () => {
      const movies: Movie[] = [
        new Movie(
          2010,
          "Inception",
          "Warner Bros.",
          "Emma Thomas, Christopher Nolan",
          true
        ),
        new Movie(
          2014,
          "Interstellar",
          "Paramount Pictures",
          "Emma Thomas, Christopher Nolan",
          false
        ),
      ];

      jest.spyOn(repository, "findAll").mockResolvedValue(movies);

      const result = await service.findAll();

      expect(result).toEqual(movies);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });
});
