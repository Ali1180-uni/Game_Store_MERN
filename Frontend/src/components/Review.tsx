import StarRating from "./Rating Stars/stars";

type ReviewProps = {
  user: string;
  review: { rating: number; comment: string };
};

const Review = ({ user, review }: ReviewProps) => {
  const initial = user.charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-700 bg-neutral-900 p-5 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-base font-bold text-white">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-white">{user}</h3>
          <StarRating value={review.rating} readOnly size={16} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-neutral-300">{review.comment}</p>
    </div>
  );
};

export default Review;