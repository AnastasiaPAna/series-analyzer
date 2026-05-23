import { NextFunction, Request, Response, Router } from "express";
import { ReviewService } from "../services/review.service";
import {
  createReviewSchema,
  recentReviewsQuerySchema,
  reviewCountsSchema,
  reviewListQuerySchema,
  updateReviewSchema
} from "../validators/review.schemas";
import { AppError } from "../types/app-error";

export function createReviewRouter(reviewService: ReviewService, adminAccessToken: string) {
  const router = Router();

  const ensureAdmin = (request: Request) => {
    // Reading reviews stays public, but edit/delete should only work after the
    // admin flow from the frontend passes the shared access token.
    if (request.header("x-admin-token") !== adminAccessToken) {
      throw new AppError("Admin access token is invalid", 403);
    }
  };

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

  router.get(
    "/api/entity3/recent",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const query = recentReviewsQuerySchema.parse(request.query);
        const reviews = await reviewService.recent(query);
        response.json(reviews);
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    "/api/entity3/:id",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        ensureAdmin(request);
        // In practice this is a string, but normalizing it here keeps the
        // service layer away from request-shape details.
        const reviewId = Array.isArray(request.params.id)
          ? request.params.id[0]
          : request.params.id;
        await reviewService.delete(reviewId);
        response.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    "/api/entity3/:id",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        ensureAdmin(request);
        // Same idea as in delete: by the time we call the service, we want one
        // plain review id and nothing transport-specific.
        const reviewId = Array.isArray(request.params.id)
          ? request.params.id[0]
          : request.params.id;
        const payload = updateReviewSchema.parse(request.body);
        const review = await reviewService.update(reviewId, payload);
        response.json(review);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
