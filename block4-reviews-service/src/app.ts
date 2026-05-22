import express from "express";
import { AppConfig } from "./types/app-config";
import { ReviewModel } from "./models/review.model";
import { Entity1ClientService } from "./services/entity1-client.service";
import { ReviewService } from "./services/review.service";
import { createReviewRouter } from "./routes/review.routes";
import { errorMiddleware } from "./middleware/error.middleware";

export function createApp(config: AppConfig) {
  const app = express();
  const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:9090",
    "http://127.0.0.1:9090"
  ]);

  const entity1ClientService = new Entity1ClientService(
    config.entity1ServiceUrl,
    config.requestTimeoutMs
  );

  const reviewService = new ReviewService(ReviewModel, entity1ClientService);

  app.use((request, response, next) => {
    const origin = request.headers.origin;

    if (origin && allowedOrigins.has(origin)) {
      response.header("Access-Control-Allow-Origin", origin);
      response.header("Vary", "Origin");
      response.header("Access-Control-Allow-Headers", "Content-Type");
      response.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    }

    if (request.method === "OPTIONS") {
      return response.sendStatus(204);
    }

    next();
  });

  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "block4-reviews-service"
    });
  });

  app.use(createReviewRouter(reviewService));
  app.use(errorMiddleware);

  return app;
}
