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
      response.header("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");
      response.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
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

  // This service stays API-first. Moderation belongs to the frontend layer,
  // which consumes the routes below the same way as any other client.
  app.get("/", (_request, response) => {
    response.json({
      service: "block4-reviews-service",
      kind: "rest-api",
      endpoints: {
        health: "/health",
        create: "POST /api/entity3",
        list: "GET /api/entity3?entity1Id=1&size=5&from=0",
        counts: "POST /api/entity3/_counts",
        recent: "GET /api/entity3/recent?size=10",
        update: "PUT /api/entity3/:id",
        delete: "DELETE /api/entity3/:id"
      }
    });
  });

  app.use(createReviewRouter(reviewService, config.adminAccessToken));
  app.use(errorMiddleware);

  return app;
}
