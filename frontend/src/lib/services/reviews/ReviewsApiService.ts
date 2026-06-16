import type { IReviewsService } from "../types";
import type { ReviewDto, CreateReviewDto, ID } from "@/lib/dto";
import { httpClient, HttpClient } from "@/lib/api/http-client";
import { endpoints } from "@/lib/api/endpoints";

export class ReviewsApiService implements IReviewsService {
  constructor(private readonly http: HttpClient = httpClient) {}

  getByProduct(productId: ID) {
    return this.http.get<ReviewDto[]>(endpoints.reviews.byProduct(productId));
  }

  create(payload: CreateReviewDto) {
    return this.http.post<ReviewDto, CreateReviewDto>(endpoints.reviews.create, payload);
  }

  async remove(reviewId: ID) {
    await this.http.delete<void>(endpoints.reviews.delete(reviewId));
  }
}
