type StarFill = "full" | "half" | "empty";

type StarRatingProps = {
  rating: number;
  size?: "sm" | "md";
  className?: string;
};

function getStarFill(rating: number, index: number): StarFill {
  const value = rating - index;
  if (value >= 0.75) return "full";
  if (value >= 0.25) return "half";
  return "empty";
}

function StarIcon({
  fill,
  sizeClass,
}: {
  fill: StarFill;
  sizeClass: string;
}) {
  const empty = (
    <svg
      viewBox="0 0 24 24"
      className={`${sizeClass} text-slate-200`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.5l2.94 5.96 6.57.95-4.75 4.63 1.12 6.54L12 17.5l-5.88 3.08 1.12-6.54-4.75-4.63 6.57-.95L12 2.5z" />
    </svg>
  );

  if (fill === "empty") return empty;

  if (fill === "full") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${sizeClass} text-amber-400`}
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2.5l2.94 5.96 6.57.95-4.75 4.63 1.12 6.54L12 17.5l-5.88 3.08 1.12-6.54-4.75-4.63 6.57-.95L12 2.5z" />
      </svg>
    );
  }

  return (
    <span className={`relative inline-flex ${sizeClass}`}>
      <svg
        viewBox="0 0 24 24"
        className={`${sizeClass} text-slate-200`}
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2.5l2.94 5.96 6.57.95-4.75 4.63 1.12 6.54L12 17.5l-5.88 3.08 1.12-6.54-4.75-4.63 6.57-.95L12 2.5z" />
      </svg>
      <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
        <svg
          viewBox="0 0 24 24"
          className={`${sizeClass} text-amber-400`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2.5l2.94 5.96 6.57.95-4.75 4.63 1.12 6.54L12 17.5l-5.88 3.08 1.12-6.54-4.75-4.63 6.57-.95L12 2.5z" />
        </svg>
      </span>
    </span>
  );
}

export default function StarRating({
  rating,
  size = "sm",
  className = "",
}: StarRatingProps) {
  const safeRating = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  const sizeClass = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${safeRating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          fill={getStarFill(safeRating, index)}
          sizeClass={sizeClass}
        />
      ))}
    </div>
  );
}
