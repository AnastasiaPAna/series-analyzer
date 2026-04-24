import { Model } from "mongoose";
import { AppError } from "../types/app-error";
import { ReviewDocument } from "../models/review.model";
import {
  CreateReviewInput,
  ReviewCountsInput,
  ReviewListQuery
} from "../validators/review.schemas";
import { Entity1ClientService } from "./entity1-client.service";

export class ReviewService {
  constructor(
    private readonly reviewModel: Model<ReviewDocument>,
    private readonly entity1ClientService: Entity1ClientService
  ) {}

  async create(input: CreateReviewInput) {
    await this.entity1ClientService.ensureSeriesExists(input.seriesId);

    const review = await this.reviewModel.create({
      ...input,
      publishedAt: input.publishedAt ?? new Date()
    });

    return this.toResponse(review);
  }

  async list(query: ReviewListQuery) {
    const reviews = await this.reviewModel
      .find({ seriesId: query.entity1Id })
      .sort({ publishedAt: -1, _id: -1 })
      .skip(query.from)
      .limit(query.size)
      .lean();

    return reviews.map((review) => this.toResponse(review));
  }

  async counts(input: ReviewCountsInput) {
    const uniqueIds = [...new Set(input.entity1Ids)];

    const counters = await this.reviewModel.aggregate<{
      _id: number;
      total: number;
    }>([
      {
        $match: {
          seriesId: { $in: uniqueIds }
        }
      },
      {
        $group: {
          _id: "$seriesId",
          total: { $sum: 1 }
        }
      }
    ]);

    return uniqueIds.reduce<Record<string, number>>((accumulator, id) => {
      const match = counters.find((counter) => counter._id === id);
      accumulator[String(id)] = match?.total ?? 0;
      return accumulator;
    }, {});
  }

  private toResponse(review: ReviewDocument | Record<string, unknown>) {
    const source = review as ReviewDocument & {
      _id?: { toString(): string };
      createdAt?: Date;
      updatedAt?: Date;
    };

    if (!source.publishedAt) {
      throw new AppError("Review response is missing publishedAt", 500);
    }

    return {
      id: source._id?.toString?.() ?? "",
      seriesId: source.seriesId,
      reviewerName: source.reviewerName,
      comment: source.comment,
      rating: source.rating,
      publishedAt: source.publishedAt,
      createdAt: source.createdAt,
      updatedAt: source.updatedAt
    };
  }
}
