import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "../Api/api";

type Product = {
  product: {
    _id: string;
    title: string;
    image: string;
    price: number;
  };
  quantity: number;
};

const Order = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-neutral-400">Loading your order...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-white">Order not found</h1>
        <p className="mt-2 text-sm text-neutral-400">
          This order doesn't exist or you don't have access to it.
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold text-white">Order Confirmed 🎉</h1>
      <p className="mt-1 text-sm text-neutral-400">Order ID: {order._id}</p>
      <p className="mt-1 text-sm text-neutral-400">
        Status: {order.orderStatus}
      </p>

      <div className="mt-6 divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900">
        {order.items.map((item: Product) => (
          <div key={item.product._id} className="flex items-center gap-4 p-4">
            <img
              src={item.product.image}
              alt={item.product.title}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-white">
                {item.product.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-400">
                Qty {item.quantity} · ${item.product.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-300">
        <p className="font-semibold text-white">Delivery Address</p>
        <p className="mt-1">
          {order.shippingAddress.fullname} · {order.shippingAddress.phone}
        </p>
        <p>
          {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
          {order.shippingAddress.province}
        </p>
      </div>

      <div className="mt-4 flex justify-between text-base font-semibold text-white">
        <span>Total (incl. shipping)</span>
        <span className="text-violet-400">${order.totalAmount.toFixed(2)}</span>
      </div>

      <Link
        to="/Games"
        className="mt-8 inline-block rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default Order;
