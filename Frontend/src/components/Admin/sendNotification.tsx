import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAllUsers, sendAdminNotification } from "../../Api/api";
import toast from "react-hot-toast";
import { useAppSelector } from "../../Redux/hook";

type FormData = {
  userId: string;
  title: string;
  message: string;
};

const SendNotification = () => {
  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAllUsers,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const sendMutation = useMutation({
    mutationFn: sendAdminNotification,
    onSuccess: () => {
      toast.success("Notification sent");
      reset();
    },
    onError: () => toast.error("Failed to send notification"),
  });

  const onSubmit = (data: FormData) => sendMutation.mutate(data);
  const currentUser = useAppSelector((state) => state.auth.user);
  const selectableUsers = users.filter((u) => u._id !== currentUser?.id);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
    >
      <h2 className="text-lg font-semibold text-white">Send Notification</h2>

      <div>
        <select
          {...register("userId", { required: "Select a user" })}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <option value="">Select a user</option>
          {selectableUsers.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        {errors.userId && (
          <p className="mt-1 text-sm text-red-500">{errors.userId.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Notification title"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("message", { required: "Message is required" })}
          rows={3}
          placeholder="Message"
          className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={sendMutation.isPending}
        className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sendMutation.isPending ? "Sending..." : "Send Notification"}
      </button>
    </form>
  );
};

export default SendNotification;
