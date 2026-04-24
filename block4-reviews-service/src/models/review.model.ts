import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const reviewSchema = new Schema(
  {
    seriesId: {
      type: Number,
      required: true,
      min: 1
    },
    reviewerName: {
      type: String,
      required: true,
      trim: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    publishedAt: {
      type: Date,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

reviewSchema.index({ seriesId: 1, publishedAt: -1 });

export type ReviewDocument = InferSchemaType<typeof reviewSchema> & {
  _id: unknown;
};

export const ReviewModel: Model<ReviewDocument> =
  (models.Review as Model<ReviewDocument>) ||
  model<ReviewDocument>("Review", reviewSchema);
