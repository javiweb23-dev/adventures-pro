/** GROQ projection: average rating + review count from tour.reviews */
export const tourRatingProjection = /* groq */ `
  "reviewsCount": count(coalesce(reviews, [])),
  "rating": select(
    count(coalesce(reviews, [])) > 0 => math::avg(reviews[].rating),
    0
  )
`;

/** GROQ projection including full review objects for detail pages */
export const tourReviewsDetailProjection = /* groq */ `
  ${tourRatingProjection},
  "reviews": coalesce(reviews, [])[]{
    _key,
    author,
    rating,
    date,
    text
  }
`;

export type TourReview = {
  _key: string;
  author?: string | null;
  rating?: number | null;
  date?: string | null;
  text?: string | null;
};

export function hasTourRating(
  rating?: number | null,
  reviewsCount?: number | null,
): boolean {
  return (rating ?? 0) > 0 && (reviewsCount ?? 0) > 0;
}

export function formatTourRating(rating: number): string {
  return rating.toFixed(1);
}
