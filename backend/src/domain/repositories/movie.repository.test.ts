import { Movie } from "../entities/movie.entity";
import { MovieRepository } from "./movie.repository";

describe("Movie Entity", () => {
  it("should create a movie instance with the given properties", () => {
    const year = 2010;
    const title = "Inception";
    const studios = "Warner Bros.";
    const producers = "Emma Thomas, Christopher Nolan";
    const winner = true;

    const movie = new Movie(year, title, studios, producers, winner);

    expect(movie.year).toBe(year);
    expect(movie.title).toBe(title);
    expect(movie.studios).toBe(studios);
    expect(movie.producers).toBe(producers);
    expect(movie.winner).toBe(winner);
  });

  it("should create a movie instance with winner set to false", () => {
    const year = 2010;
    const title = "Inception";
    const studios = "Warner Bros.";
    const producers = "Emma Thomas, Christopher Nolan";
    const winner = false;

    const movie = new Movie(year, title, studios, producers, winner);

    expect(movie.year).toBe(year);
    expect(movie.title).toBe(title);
    expect(movie.studios).toBe(studios);
    expect(movie.producers).toBe(producers);
    expect(movie.winner).toBe(winner);
  });
});

describe("Movie Repository", () => {
  let repository: MovieRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      insertMany: jest.fn(),
    };
  });

  it("should create a new movie", async () => {
    const movie = new Movie(
      2010,
      "Inception",
      "Warner Bros.",
      "Emma Thomas, Christopher Nolan",
      true
    );
    (repository.create as jest.Mock).mockResolvedValue(movie);

    const result = await repository.create(movie);

    expect(result).toEqual(movie);
    expect(repository.create).toHaveBeenCalledWith(movie);
  });

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
    (repository.findAll as jest.Mock).mockResolvedValue(movies);

    const result = await repository.findAll();

    expect(result).toEqual(movies);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
