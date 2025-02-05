import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { CreateMovieDto } from "../../application/dtos/create-movie.dto";
import { MoviesService } from "../../application/services/movies.service";
import { MoviesController } from "./movies.controller";

describe("MoviesController (e2e)", () => {
  let app: INestApplication;
  let moviesService: MoviesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    moviesService = moduleFixture.get<MoviesService>(MoviesService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /movies/upload-csv", () => {
    it("should process CSV file and create movies", async () => {
      const csvContent = `year;title;studios;producers;winner
                          1980;Movie A;Studio X;Producer A;yes
                          1985;Movie B;Studio Y;Producer B;no
                          1990;Movie C;Studio Z;Producer A;yes`;

      jest
        .spyOn(moviesService, "create")
        .mockImplementation(async (dto: CreateMovieDto) => {
          return Promise.resolve({
            id: 1,
            ...dto,
          } as any);
        });

      const response = await request(app.getHttpServer())
        .post("/movies/upload-csv")
        .attach("file", Buffer.from(csvContent), "test.csv")
        .expect(201);

      expect(response.body).toEqual({
        message: "CSV file processed successfully",
      });
      expect(moviesService.create).toHaveBeenCalledTimes(3);
    });

    it("should return 400 if CSV data is invalid", async () => {
      const invalidCsvContent = `year;title;studios;producers;winner
                                 1980;;Studio X;Producer A;yes`;

      const response = await request(app.getHttpServer())
        .post("/movies/upload-csv")
        .attach("file", Buffer.from(invalidCsvContent), "test.csv")
        .expect(400);

      expect(response.body.message).toContain("Invalid data in row");
    });
  });

  describe("GET /movies/producers-intervals", () => {
    it("should return producer intervals", async () => {
      const mockMovies = [
        {
          year: 1980,
          title: "Movie A",
          studios: "Studio X",
          producers: "Producer A",
          winner: true,
        },
        {
          year: 1990,
          title: "Movie C",
          studios: "Studio Z",
          producers: "Producer A",
          winner: true,
        },
      ];

      jest.spyOn(moviesService, "findAll").mockResolvedValue(mockMovies);

      const response = await request(app.getHttpServer())
        .get("/movies/producers-intervals")
        .expect(200);

      expect(response.body).toEqual({
        min: [
          {
            producer: "Producer A",
            interval: 10,
            previousWin: 1980,
            followingWin: 1990,
          },
        ],
        max: [
          {
            producer: "Producer A",
            interval: 10,
            previousWin: 1980,
            followingWin: 1990,
          },
        ],
      });
    });

    it("should return empty intervals if no winning producers", async () => {
      jest.spyOn(moviesService, "findAll").mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get("/movies/producers-intervals")
        .expect(200);

      expect(response.body).toEqual({ min: [], max: [] });
    });
  });
});
