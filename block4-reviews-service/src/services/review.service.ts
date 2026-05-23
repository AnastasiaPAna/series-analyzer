import { isValidObjectId, Model } from "mongoose";
import { AppError } from "../types/app-error";
import { ReviewDocument } from "../models/review.model";
import {
  CreateReviewInput,
  RecentReviewsQuery,
  ReviewCountsInput,
  ReviewListQuery,
  UpdateReviewInput
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
      // If the client does not send a publish time, we stamp it here so the
      // list still has a stable timeline.
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

    // This is exactly the kind of work Mongo should do for us. Loading every
    // review into memory just to count them would be wasteful.
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

  async recent(query: RecentReviewsQuery) {
    const reviews = await this.reviewModel
      .find({})
      .sort({ publishedAt: -1, _id: -1 })
      .limit(query.size)
      .lean();

    return reviews.map((review) => this.toResponse(review));
  }

  async delete(reviewId: string) {
    if (!isValidObjectId(reviewId)) {
      throw new AppError("Review id is invalid", 400);
    }

    const deleted = await this.reviewModel.findByIdAndDelete(reviewId).lean();

    if (!deleted) {
      throw new AppError(`Review with id ${reviewId} was not found`, 404);
    }
  }

  async update(reviewId: string, input: UpdateReviewInput) {
    if (!isValidObjectId(reviewId)) {
      throw new AppError("Review id is invalid", 400);
    }

    await this.entity1ClientService.ensureSeriesExists(input.seriesId);

    const updated = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      {
        ...input,
        publishedAt: input.publishedAt ?? new Date()
      },
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!updated) {
      throw new AppError(`Review with id ${reviewId} was not found`, 404);
    }

    return this.toResponse(updated);
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

    // Some callers use lean objects, others use mongoose documents. Routing
    // both through one mapper keeps the API response shape consistent.
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
