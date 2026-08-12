import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchAllOrders, updateOrderPayment, updateOrderStatus, type AdminOrder } from "../../Api/Admin.api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const PAYMENT_OPTIONS = ["Pending", "Completed", "Failed"];
const STATUS_OPTIONS = ["Pending", "Processing", "Delivered", "Cancelled"];

const statusColor: Record<string, string> = {
  Pending: "bg-neutral-800 text-neutral-300",
  Processing: "bg-sky-500/10 text-sky-400",
  Delivered: "bg-green-500/10 text-green-400",
  Cancelled: "bg-red-500/10 text-red-500",
  Completed: "bg-green-500/10 text-green-400",
  Failed: "bg-red-500/10 text-red-500",
};

const ConfirmCancelDialog = ({
  orderId,
  onCancel,
  onConfirm,
  isUpdating,
}: {
  orderId: string;
  onCancel: () => void;
  onConfirm: () => void;
  isUpdating: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
    <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center">
      <h3 className="text-lg font-semibold text-white">Cancel this order?</h3>
      <p className="mt-2 text-sm text-neutral-400">
        Order <span className="text-white">#{orderId.slice(-8)}</span> will be marked cancelled and
        stock restocked. Customer will be notified.
      </p>
      <div className="mt-6 flex gap-2.5">
        <button
          onClick={onConfirm}
          disabled={isUpdating}
          className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {isUpdating ? "Cancelling..." : "Cancel Order"}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-neutral-700 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
        >
          Back
        </button>
      </div>
    </div>
  </div>
);

const EditOrder = () => {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data: orders = [], isLoading, isError } = useQuery<AdminOrder[]>({
    queryKey: ["admin", "orders"],
    queryFn: fetchAllOrders,
  });

  const paymentMutation = useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: string }) =>
      updateOrderPayment(id, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Payment status updated");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update payment");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: string }) =>
      updateOrderStatus(id, orderStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated");
      setCancellingId(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update order status");
    },
  });

  if (isLoading) return <p className="text-sm text-neutral-500">Loading orders...</p>;
  if (isError) return <p className="text-sm text-red-500">Failed to load orders.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Order Management</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Confirm payments, update fulfillment status, and review full order details.
        </p>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-sm text-neutral-500">No orders found.</p>
        ) : (
          orders.map((order) => {
            const isOpen = expandedId === order._id;
            return (
              <div
                key={order._id}
                className="rounded-lg border border-neutral-800 bg-neutral-900/50 transition-colors"
              >
                {/* Summary row */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : order._id)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        #{order._id.slice(-8)}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusColor[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusColor[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-neutral-400">
                      {order.customer?.name || "Unknown"} • {order.customer?.email || "—"} •{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <ExpandMoreIcon
                      fontSize="small"
                      className={`text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-neutral-800 p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Items */}
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          Items
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <img
                                src={item.product?.image}
                                alt={item.product?.title}
                                className="h-10 w-10 rounded object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-white">{item.product?.title}</p>
                                <p className="text-xs text-neutral-500">
                                  Qty {item.quantity} × ${item.product?.price?.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping + payment info */}
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          Shipping
                        </p>
                        <p className="text-sm text-neutral-300">{order.shippingAddress?.fullName}</p>
                        <p className="text-sm text-neutral-400">{order.shippingAddress?.phone}</p>
                        <p className="text-sm text-neutral-400">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.province}
                        </p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          Payment Method
                        </p>
                        <p className="text-sm text-neutral-300">{order.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-4 flex flex-wrap items-end gap-4 border-t border-neutral-800 pt-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                          Payment Status
                        </label>
                        <select
                          value={order.paymentStatus}
                          disabled={paymentMutation.isPending}
                          onChange={(e) =>
                            paymentMutation.mutate({ id: order._id, paymentStatus: e.target.value })
                          }
                          className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                        >
                          {PAYMENT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                          Order Status
                        </label>
                        <select
                          value={order.orderStatus}
                          disabled={statusMutation.isPending}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "Cancelled") {
                              setCancellingId(order._id);
                            } else {
                              statusMutation.mutate({ id: order._id, orderStatus: value });
                            }
                          }}
                          className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <span className="text-xs text-neutral-500">
                        Shipping: ${order.shippingCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {cancellingId && (
        <ConfirmCancelDialog
          orderId={cancellingId}
          isUpdating={statusMutation.isPending}
          onCancel={() => setCancellingId(null)}
          onConfirm={() =>
            statusMutation.mutate({ id: cancellingId, orderStatus: "Cancelled" })
          }
        />
      )}
    </div>
  );
};

export default EditOrder;