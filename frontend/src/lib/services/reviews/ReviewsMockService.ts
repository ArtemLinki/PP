import type { IReviewsService } from "../types";
import type { ReviewDto, CreateReviewDto, ID } from "@/lib/dto";
import { delay, nextId } from "../_utils";

export class ReviewsMockService implements IReviewsService {
  private reviews: ReviewDto[] = [];

  async getByProduct(productId: ID): Promise<ReviewDto[]> {
    await delay();
    return this.reviews.filter((r) => r.productId === productId);
  }

  async create(payload: CreateReviewDto): Promise<ReviewDto> {
    await delay();
    const existing = this.reviews.find((r) => r.productId === payload.productId);
    if (existing) throw { code: "CONFLICT", message: "Вы уже оставили отзыв" };
    const review: ReviewDto = {
      id: nextId("rev"),
      productId: payload.productId,
      userId: "mock-user",
      authorName: "Вы",
      rating: payload.rating,
      comment: payload.comment ?? null,
      createdAt: new Date().toISOString(),
    };
    this.reviews.unshift(review);
    return review;
  }

  async remove(reviewId: ID): Promise<void> {
    await delay();
    this.reviews = this.reviews.filter((r) => r.id !== reviewId);
  }
}
