import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AxiosError } from "axios";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser,
} from "../../Api/api";
import { type AdminUser } from "../../Api/Admin.api";
import { useAppSelector } from "../../Redux/hook";
import EditUserModal from "./Dailogues/EditUserDialogue";
import ConfirmDeleteDialog from "./Dailogues/DeleteConfirmation";
import toast from "react-hot-toast";

const ROLES: AdminUser["role"][] = ["Customer", "Employee", "Admin"];

const AddEmployee = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAllUsers,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role updated");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update role");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deleted");
      setDeletingUser(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to delete user");
    },
  });

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading users...</p>;
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-white">All Users</h2>

      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {users.map((u) => {
              const isSelf = u._id === currentUser?.id;
              return (
                <tr key={u._id} className="text-neutral-300">
                  <td className="px-4 py-3">
                    {u.name}{" "}
                    {isSelf && (
                      <span className="text-xs text-violet-400">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={isSelf || roleMutation.isPending}
                      onChange={(e) =>
                        roleMutation.mutate({ id: u._id, role: e.target.value })
                      }
                      className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        u.accountStatus === "Ban"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {u.accountStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => !isSelf && setEditingUser(u)}
                        disabled={isSelf}
                        aria-label={`Edit ${u.name}`}
                        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => !isSelf && setDeletingUser(u)}
                        disabled={isSelf}
                        aria-label={`Delete ${u.name}`}
                        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <ConfirmDeleteDialog
          userName={deletingUser.name}
          onCancel={() => setDeletingUser(null)}
          onConfirm={() => deleteMutation.mutate(deletingUser._id)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default AddEmployee;
