import express from "express";
import mongoose from "mongoose";
import request from "supertest";
import { AddressInfo } from "node:net";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../src/app";
import { connectToDatabase, disconnectDatabase } from "../src/db/connect";
import { AppConfig } from "../src/types/app-config";
import { ReviewModel } from "../src/models/review.model";

describe("Reviews API integration", () => {
  let mongoServer: MongoMemoryServer;
  let sourceServiceServer: ReturnType<express.Application["listen"]>;
  let appConfig: AppConfig;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const sourceServiceApp = express();
    sourceServiceApp.get("/api/v1/series/:id", (req, res) => {
      const id = Number(req.params.id);
      if ([1, 2].includes(id)) {
        return res.json({
          id,
          title: `Series ${id}`
        });
      }

      return res.status(404).json({
        message: "Series not found"
      });
    });

    await new Promise<void>((resolve) => {
      sourceServiceServer = sourceServiceApp.listen(0, () => resolve());
    });

    const sourcePort = (sourceServiceServer.address() as AddressInfo).port;

    appConfig = {
      port: 0,
      mongodbUri: mongoServer.getUri(),
      entity1ServiceUrl: `http://127.0.0.1:${sourcePort}`,
      requestTimeoutMs: 2000,
      adminAccessToken: "series-admin-access"
    };

    await connectToDatabase(appConfig.mongodbUri);
  });

  afterEach(async () => {
    await ReviewModel.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDatabase();
    await mongoServer.stop();
    await new Promise<void>((resolve, reject) => {
      sourceServiceServer.close((error?: Error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

  it("POST /api/entity3 creates a review and auto-fills publishedAt", async () => {
    const app = createApp(appConfig);

    const response = await request(app)
      .post("/api/entity3")
      .send({
        seriesId: 1,
        reviewerName: "Anna",
        comment: "A stylish and very atmospheric series.",
        rating: 9.5
      });

    expect(response.status).toBe(201);
    expect(response.body.seriesId).toBe(1);
    expect(response.body.reviewerName).toBe("Anna");
    expect(response.body.publishedAt).toBeTruthy();
  });

  it("POST /api/entity3 returns 404 when source series does not exist", async () => {
    const app = createApp(appConfig);

    const response = await request(app)
      .post("/api/entity3")
      .send({
        seriesId: 999,
        reviewerName: "Anna",
        comment: "This review should fail because the series is missing.",
        rating: 8
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("Series with id 999");
  });

  it("GET /api/entity3 returns reviews sorted by publishedAt desc with paging", async () => {
    await ReviewModel.create([
      {
        seriesId: 1,
        reviewerName: "Anna",
        comment: "First review with an older publication date.",
        rating: 8,
        publishedAt: new Date("2024-01-10T10:00:00.000Z")
      },
      {
        seriesId: 1,
        reviewerName: "Kate",
        comment: "Second review with the latest publication date.",
        rating: 10,
        publishedAt: new Date("2024-02-10T10:00:00.000Z")
      },
      {
        seriesId: 1,
        reviewerName: "Lina",
        comment: "Third review that should be skipped by paging.",
        rating: 7,
        publishedAt: new Date("2024-01-01T10:00:00.000Z")
      }
    ]);

    const app = createApp(appConfig);

    const response = await request(app)
      .get("/api/entity3")
      .query({
        entity1Id: 1,
        size: 2,
        from: 0
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].reviewerName).toBe("Kate");
    expect(response.body[1].reviewerName).toBe("Anna");
  });

  it("POST /api/entity3/_counts returns aggregate counts without loading reviews", async () => {
    await ReviewModel.create([
      {
        seriesId: 1,
        reviewerName: "Anna",
        comment: "Review one for the first series entry.",
        rating: 9,
        publishedAt: new Date("2024-01-10T10:00:00.000Z")
      },
      {
        seriesId: 1,
        reviewerName: "Kate",
        comment: "Review two for the same first series entry.",
        rating: 8,
        publishedAt: new Date("2024-01-11T10:00:00.000Z")
      },
      {
        seriesId: 2,
        reviewerName: "Lina",
        comment: "Only one review for the second series entry.",
        rating: 7,
        publishedAt: new Date("2024-01-12T10:00:00.000Z")
      }
    ]);

    const app = createApp(appConfig);

    const response = await request(app)
      .post("/api/entity3/_counts")
      .send({
        entity1Ids: [1, 2, 3]
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "1": 2,
      "2": 1,
      "3": 0
    });
  });

  it("GET /api/entity3/recent returns the latest reviews across all series", async () => {
    await ReviewModel.create([
      {
        seriesId: 1,
        reviewerName: "Anna",
        comment: "Older review for the first series item.",
        rating: 8,
        publishedAt: new Date("2024-01-10T10:00:00.000Z")
      },
      {
        seriesId: 2,
        reviewerName: "Kate",
        comment: "Newest review that should be listed first.",
        rating: 9,
        publishedAt: new Date("2024-02-10T10:00:00.000Z")
      }
    ]);

    const app = createApp(appConfig);

    const response = await request(app)
      .get("/api/entity3/recent")
      .query({ size: 5 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].reviewerName).toBe("Kate");
    expect(response.body[1].reviewerName).toBe("Anna");
  });

  it("DELETE /api/entity3/:id removes an existing review", async () => {
    const created = await ReviewModel.create({
      seriesId: 1,
      reviewerName: "Anna",
      comment: "Review that should be removable by admin tools.",
      rating: 8,
      publishedAt: new Date("2024-01-10T10:00:00.000Z")
    });

    const app = createApp(appConfig);

    const response = await request(app)
      .delete(`/api/entity3/${String(created._id)}`)
      .set("X-Admin-Token", appConfig.adminAccessToken);

    expect(response.status).toBe(204);

    const stillExists = await ReviewModel.findById(created._id);
    expect(stillExists).toBeNull();
  });
  it("DELETE /api/entity3/:id returns 403 without a valid admin token", async () => {
    const created = await ReviewModel.create({
      seriesId: 1,
      reviewerName: "Anna",
      comment: "Review that should stay in place without admin permissions.",
      rating: 8,
      publishedAt: new Date("2024-01-10T10:00:00.000Z")
    });

    const app = createApp(appConfig);

    const response = await request(app)
      .delete(`/api/entity3/${String(created._id)}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("Admin access token is invalid");

    const stillExists = await ReviewModel.findById(created._id);
    expect(stillExists).not.toBeNull();
  });

  it("PUT /api/entity3/:id updates an existing review for admin moderation", async () => {
    const created = await ReviewModel.create({
      seriesId: 1,
      reviewerName: "Anna",
      comment: "Original review text before the admin edit.",
      rating: 8,
      publishedAt: new Date("2024-01-10T10:00:00.000Z")
    });

    const app = createApp(appConfig);

    const response = await request(app)
      .put(`/api/entity3/${String(created._id)}`)
      .set("X-Admin-Token", appConfig.adminAccessToken)
      .send({
        seriesId: 1,
        reviewerName: "Anna Updated",
        comment: "Updated review text after the moderation edit.",
        rating: 9.5
      });

    expect(response.status).toBe(200);
    expect(response.body.reviewerName).toBe("Anna Updated");
    expect(response.body.comment).toBe("Updated review text after the moderation edit.");
    expect(response.body.rating).toBe(9.5);

    const stored = await ReviewModel.findById(created._id).lean();
    expect(stored?.reviewerName).toBe("Anna Updated");
    expect(stored?.comment).toBe("Updated review text after the moderation edit.");
    expect(stored?.rating).toBe(9.5);
  });

  it("PUT /api/entity3/:id returns 403 without a valid admin token", async () => {
    const created = await ReviewModel.create({
      seriesId: 1,
      reviewerName: "Anna",
      comment: "Original review text before a forbidden update.",
      rating: 8,
      publishedAt: new Date("2024-01-10T10:00:00.000Z")
    });

    const app = createApp(appConfig);

    const response = await request(app)
      .put(`/api/entity3/${String(created._id)}`)
      .send({
        seriesId: 1,
        reviewerName: "Blocked edit",
        comment: "This update should not pass without the admin token.",
        rating: 9
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("Admin access token is invalid");

    const stored = await ReviewModel.findById(created._id).lean();
    expect(stored?.reviewerName).toBe("Anna");
    expect(stored?.comment).toBe("Original review text before a forbidden update.");
    expect(stored?.rating).toBe(8);
  });
});

