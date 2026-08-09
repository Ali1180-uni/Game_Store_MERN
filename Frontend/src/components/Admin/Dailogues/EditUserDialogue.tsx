import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StarRating from "../../Rating Stars/stars";
import { AxiosError } from "axios";
import {
  updateUser,
  updateAccountStatus,
  fetchUserReviews,
  type AdminUser,
} from "../../../Api/Admin.api";
import toast from "react-hot-toast";

type EditFormData = {
  name: string;
  email: string;
};

type EditUserModalProps = {
  user: AdminUser;
  onClose: () => void;
};

const EditUserModal = ({ user, onClose }: EditUserModalProps) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"Ban" | "No Ban">(user.accountStatus);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormData>({
    defaultValues: { name: user.name, email: user.email },
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["admin", "user-reviews", user._id],
    queryFn: () => fetchUserReviews(user._id),
  });

  const editMutation = useMutation({
    mutationFn: (data: EditFormData) => updateUser(user._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User updated");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update user");
    },
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus: "Ban" | "No Ban") => updateAccountStatus(user._id, newStatus),
    onSuccess: (_, newStatus) => {
      setStatus(newStatus);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(newStatus === "Ban" ? "User banned" : "User unbanned");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update status");
    },
  });

  const onSubmit = (data: EditFormData) => editMutation.mutate(data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="text-lg font-semibold text-white">Edit User</h3>

        {/* Name / Email */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
              })}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={editMutation.isPending}
            className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
          >
            {editMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Account status */}
        <div className="mt-6 border-t border-neutral-800 pt-5">
          <p className="mb-2 text-sm font-medium text-neutral-300">Account Status</p>
          <div className="flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3">
            <span
              className={`text-sm font-medium ${
                status === "Ban" ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {status}
            </span>
            <button
              onClick={() => statusMutation.mutate(status === "Ban" ? "No Ban" : "Ban")}
              disabled={statusMutation.isPending}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
                status === "Ban"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {statusMutation.isPending
                ? "Updating..."
                : status === "Ban"
                  ? "Unban User"
                  : "Ban User"}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">
            The user gets a notification automatically when this changes.
          </p>
        </div>

        {/* Reviews */}
        <div className="mt-6 border-t border-neutral-800 pt-5">
          <p className="mb-3 text-sm font-medium text-neutral-300">
            Reviews by this user {reviews.length > 0 && `(${reviews.length})`}
          </p>

          {reviewsLoading ? (
            <p className="text-sm text-neutral-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-neutral-500">This user hasn't written any reviews.</p>
          ) : (
            <div className="max-h-56 space-y-2 overflow-y-auto">
              {reviews.map((r) => (
                <div key={r._id} className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{r.product.title}</span>
                    <StarRating value={r.rating} readOnly size={13} />
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-neutral-700 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EditUserModal;