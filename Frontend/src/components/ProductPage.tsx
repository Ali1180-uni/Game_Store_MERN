import { useParams, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import StarRating from "./Rating Stars/stars";
import Review from "./Review";
import { useAppDispatch, useAppSelector } from "../Redux/hook";
import { addItem } from "../Redux/CartSlice/cartSlice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductById, fetchReviews, submitReview } from "../Api/api";
import toast from "react-hot-toast";
import { setCheckoutItems } from "../Redux/CheckoutSlice/CheckoutSlice";

type ReviewFormData = {
  rating: number;
  comment: string;
};

type Product = {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
};

type ReviewDoc = {
  _id: string;
  user: { _id: string; name: string } | null;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const MAX_COMMENT_LENGTH = 500;

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });
  const handleBuyNow = () => {
    if (!product) return;

    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    dispatch(
      setCheckoutItems([
        {
          productId: product._id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity: 1,
        },
      ]),
    );

    navigate("/checkout");
  };

  const qtyInCart = useAppSelector((state) =>
    product ? (state.cart.items[product._id] ?? 0) : 0,
  );
  const atMax = qtyInCart >= 5;

  const { data: reviews = [] } = useQuery<ReviewDoc[]>({
    queryKey: ["reviews", product?._id],
    queryFn: () => fetchReviews(product!._id),
    enabled: !!product,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({ defaultValues: { rating: 0, comment: "" } });

  const reviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", product?._id] });
      toast.success("Review submitted!");
      reset();
    },
    onError: () => {
      toast.error("Couldn't submit your review. Try again.");
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    reviewMutation.mutate({
      productId: product!._id,
      rating: data.rating,
      comment: data.comment.trim().slice(0, MAX_COMMENT_LENGTH),
    });
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
        <NavLink
          to="/Games"
          className="mt-6 inline-block rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          Back to Games
        </NavLink>
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
            <button
              onClick={handleBuyNow}
              className="flex-1 rounded-lg bg-violet-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 sm:px-8"
            >
              Buy Now
            </button>
            <button
              onClick={() => {
                dispatch(addItem(product._id));
                toast.success(`${product.title} added to cart`);
              }}
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

        {token ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 max-w-lg space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <div>
              <Controller
                name="rating"
                control={control}
                rules={{ min: { value: 1, message: "Please select a rating" } }}
                render={({ field }) => (
                  <StarRating value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.rating && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div>
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
                <p className="mt-1 text-sm text-red-500">
                  {errors.comment.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={reviewMutation.isPending}
              className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="mt-6 max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-5 text-center">
            <p className="text-sm text-neutral-400">
              <NavLink
                to="/login"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                Log in
              </NavLink>{" "}
              to write a review.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          {reviews.map((r) => (
            <Review
              key={r._id}
              user={r.user?.name ?? "Anonymous"}
              review={{ rating: r.rating, comment: r.comment }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
