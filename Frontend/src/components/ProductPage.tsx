import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { nanoid } from "nanoid";
import StarRating from "./Rating Stars/stars";
import Review from "./Review";
import { useAppDispatch, useAppSelector } from "../Redux/hook";
import { addItem } from "../Redux/CartSlice/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../Api/api";

type ReviewEntry = {
  id: string;
  user: string;
  rating: number;
  comment: string;
};

type ReviewFormData = {
  rating: number;
  comment: string;
};

const MAX_COMMENT_LENGTH = 500;

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const qtyInCart = useAppSelector((state) =>
    product ? state.cart.items[product._id] ?? 0 : 0
  );
  const atMax = qtyInCart >= 5;

  const [reviews, setReviews] = useState<ReviewEntry[]>([
    { id: "seed-1", user: "Ali", rating: 3, comment: "Great product!" },
  ]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({ defaultValues: { rating: 0, comment: "" } });

  const onSubmit = (data: ReviewFormData) => {
    const newReview: ReviewEntry = {
      id: nanoid(),
      user: "You", // replace with the authenticated user from your session
      rating: data.rating,
      comment: data.comment.trim().slice(0, MAX_COMMENT_LENGTH),
    };
    setReviews((prev) => [newReview, ...prev]);
    reset();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-white">Product not found</h1>
        <p className="mt-2 text-sm text-neutral-400">
          We couldn't find a game with that ID.
        </p>
        <Link
          to="/Games"
          className="mt-6 inline-block rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          Back to Games
        </Link>
      </div>
    );
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-125 w-full object-contain"
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-16">
          <h1 className="text-4xl font-bold text-white">{product.title}</h1>

          <div className="mt-3 flex items-center gap-2">
            <StarRating value={Math.round(avgRating)} readOnly size={18} />
            <span className="text-sm text-neutral-400">
              {avgRating.toFixed(1)} ({reviews.length} review
              {reviews.length !== 1 ? "s" : ""})
            </span>
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
            {product.description}
          </p>

          <p className="mt-6 text-3xl font-bold text-violet-400">
            ${product.price.toFixed(2)}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="flex-1 rounded-lg bg-violet-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 sm:px-8">
              Buy Now
            </button>
            <button
              onClick={() => dispatch(addItem(product._id))}
              disabled={atMax}
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 py-3.5 text-sm font-semibold text-white transition-colors hover:border-violet-500/50 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
            >
              {atMax ? "Max Quantity Reached" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 px-6 py-14 sm:px-10 md:px-16">
        <h2 className="text-xl font-semibold text-white">Customer Reviews</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 max-w-lg space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
        >
          <Controller
            name="rating"
            control={control}
            rules={{ min: { value: 1, message: "Please select a rating" } }}
            render={({ field }) => (
              <StarRating value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.rating && (
            <p className="text-sm text-red-500">{errors.rating.message}</p>
          )}

          <textarea
            {...register("comment", {
              required: "Please write a comment",
              minLength: { value: 3, message: "Comment is too short" },
              maxLength: {
                value: MAX_COMMENT_LENGTH,
                message: `Keep it under ${MAX_COMMENT_LENGTH} characters`,
              },
              validate: (v) =>
                v.trim().length > 0 || "Comment can't be just whitespace",
            })}
            rows={3}
            placeholder="Write a review..."
            className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
          {errors.comment && (
            <p className="text-sm text-red-500">{errors.comment.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Submit Review
          </button>
        </form>

        <div className="mt-8 flex flex-wrap gap-4">
          {reviews.map((r) => (
            <Review
              key={r.id}
              user={r.user}
              review={{ rating: r.rating, comment: r.comment }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;