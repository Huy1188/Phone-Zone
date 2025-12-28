export type ReviewUser = {
  user_id: number;
  username: string;
  avatar?: string | null;
};

export type Review = {
  review_id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  user?: ReviewUser;
};

export type ReviewSummary = {
  avg: number;
  count: number;
  dist: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type ReviewsResponse = {
  success: boolean;
  reviews: Review[];
  meta: { total: number; page: number; limit: number };
};

export type ReviewSummaryResponse = {
  success: boolean;
  summary: ReviewSummary;
};

export type UpsertReviewResponse = {
  success: boolean;
  review: Review;
  created?: boolean;
  updated?: boolean;
};