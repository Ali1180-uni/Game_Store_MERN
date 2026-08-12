import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDeleteReviewDialog from "./Dailogues/ReviewDeleteDialogue";
import {
  fetchAllReviews,
  deleteReview,
  updateReview,
} from "../../Api/Admin.api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type ReviewDoc = {
  user: { name: string; email: string } | null;
  _id: string;
  product: { _id: string; title: string; image: string };
  rating: number;
  comment: string;
  createdAt: string;
};

type EditReviewFormValues = {
  rating: number;
  comment: string;
};

const UserReviews = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingReview, setDeletingReview] = useState<ReviewDoc | null>(null);

  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery<ReviewDoc[]>({
    queryKey: ["admin", "reviews"],
    queryFn: fetchAllReviews,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditReviewFormValues>();

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Review deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditReviewFormValues }) =>
      updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Review updated successfully");
      setEditingId(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update review");
    },
  });

  const handleEditClick = (review: ReviewDoc) => {
    setEditingId(review._id);
    reset({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const onSubmitEdit = (data: EditReviewFormValues) => {
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: { rating: Number(data.rating), comment: data.comment },
      });
    }
  };

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading reviews...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-500">Failed to load reviews.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          User Reviews Management
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          Moderate, edit, or delete customer reviews across all products.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-neutral-500">No reviews found.</p>
        ) : (
          reviews.map((review: ReviewDoc) => (
            <div
              key={review._id}
              className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:bg-neutral-900"
            >
              {editingId === review._id ? (
                // EDIT MODE UI
                <form
                  onSubmit={handleSubmit(onSubmitEdit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        {...register("rating", {
                          required: "Rating is required",
                          valueAsNumber: true,
                          min: { value: 1, message: "Minimum rating is 1" },
                          max: { value: 5, message: "Maximum rating is 5" },
                        })}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                      />
                      {errors.rating && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.rating.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                      Comment
                    </label>
                    <textarea
                      {...register("comment", {
                        required: "Comment is required",
                      })}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    />
                    {errors.comment && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.comment.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
                    >
                      {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-neutral-700 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // VIEW MODE UI
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        {review.user?.name || "Unknown User"}
                      </h3>
                      <span className="text-xs text-neutral-500">•</span>
                      <span className="text-xs text-neutral-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-violet-400">
                      Product: {review.product?.title || "Unknown Product"}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-300">
                        Rating: {review.rating}/5
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-neutral-300">
                      {review.comment}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleEditClick(review)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                      aria-label="Edit review"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => setDeletingReview(review)}
                      disabled={deleteMutation.isPending}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                      aria-label="Delete review"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {deletingReview && (
        <ConfirmDeleteReviewDialog
          reviewerName={deletingReview.user?.name || "this user"}
          isDeleting={deleteMutation.isPending}
          onCancel={() => setDeletingReview(null)}
          onConfirm={() => {
            deleteMutation.mutate(deletingReview._id, {
              onSuccess: () => setDeletingReview(null),
            });
          }}
        />
      )}
    </div>
  );
};

export default UserReviews;
