import { api } from "@/lib/api";
import { withQuery } from "@/lib/query";
import type { ReviewsResponse, ReviewSummaryResponse, UpsertReviewResponse } from "@/types/review";

export type CanReviewResponse = {
  success: boolean;
  can: boolean;
  reason?: "not_logged_in" | "not_delivered" | null;
};

export async function fetchCanReview(productId: number) {
  return api<CanReviewResponse>(`/products/${productId}/reviews/can-review`, {
    cache: "no-store",
  });
}

export async function fetchReviewSummary(productId: number) {
  return api<ReviewSummaryResponse>(`/products/${productId}/reviews/summary`, {
    cache: "no-store",
  });
}

export async function fetchReviewsPaged(params: { productId: number; page?: number; limit?: number }) {
  const path = withQuery(`/products/${params.productId}/reviews`, {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  });

  return api<ReviewsResponse>(path, { cache: "no-store" });
}

export async function upsertMyReview(params: { productId: number; rating: number; comment: string }) {
  return api<UpsertReviewResponse>(`/products/${params.productId}/reviews`, {
    method: "POST",
    body: { rating: params.rating, comment: params.comment }, // ✅ để api.ts tự stringify + set Content-Type
    cache: "no-store",
  });
}
