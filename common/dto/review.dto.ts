import type { ID, ISODateString } from './common.dto';

export interface ReviewDto {
  id: ID;
  productId: ID;
  userId: ID;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: ISODateString;
}

export interface CreateReviewDto {
  productId: ID;
  rating: number;
  comment?: string;
}
