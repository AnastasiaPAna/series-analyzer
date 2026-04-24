import { NextFunction, Request, Response, Router } from "express";
import { ReviewService } from "../services/review.service";
import {
  createReviewSchema,
  reviewCountsSchema,
  reviewListQuerySchema
} from "../validators/review.schemas";

export function createReviewRouter(reviewService: ReviewService) {
  const router = Router();

  router.post(
    "/api/entity3",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const payload = createReviewSchema.parse(request.body);
        const review = await reviewService.create(payload);
        response.status(201).json(review);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    "/api/entity3",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const query = reviewListQuerySchema.parse(request.query);
        const reviews = await reviewService.list(query);
        response.json(reviews);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/api/entity3/_counts",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const payload = reviewCountsSchema.parse(request.body);
        const counts = await reviewService.counts(payload);
        response.json(counts);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
