import { z } from "zod";

export const createReviewSchema = z.object({
  seriesId: z.coerce.number().int().positive("seriesId must be a positive integer"),
  reviewerName: z
    .string()
    .trim()
    .min(2, "reviewerName must contain at least 2 characters")
    .max(80, "reviewerName must contain at most 80 characters"),
  comment: z
    .string()
    .trim()
    .min(10, "comment must contain at least 10 characters")
    .max(1000, "comment must contain at most 1000 characters"),
  rating: z
    .coerce
    .number()
    .min(1, "rating must be at least 1")
    .max(10, "rating must be at most 10"),
  publishedAt: z.coerce.date().optional()
});

export const reviewListQuerySchema = z.object({
  entity1Id: z.coerce.number().int().positive("entity1Id must be a positive integer"),
  size: z.coerce.number().int().positive().max(100).default(5),
  from: z.coerce.number().int().min(0).default(0)
});

export const reviewCountsSchema = z.object({
  entity1Ids: z
    .array(z.coerce.number().int().positive("Each entity1Id must be a positive integer"))
    .min(1, "entity1Ids must not be empty")
    .max(100, "entity1Ids must contain at most 100 ids")
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>;
export type ReviewCountsInput = z.infer<typeof reviewCountsSchema>;
