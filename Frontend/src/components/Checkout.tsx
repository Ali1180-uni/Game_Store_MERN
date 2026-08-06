import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector, useAppDispatch } from "../Redux/hook";
import { clearCheckout } from "../Redux/CheckoutSlice/CheckoutSlice";
import { clearCart } from "../Redux/CartSlice/cartSlice";
import {
  fetchAddresses,
  addAddress,
  createOrderApi,
  type Address,
} from "../Api/api";
import toast from "react-hot-toast";

type CheckoutFormData = {
  addressId: string;
  fullname: string;
  phone: string;
  province: string;
  city: string;
  street: string;
  paymentMethod: "jazzCash" | "card" | "cashOnDelivery" | "";
};

const PROVINCES = [
  "Punjab",
  "Sindh",
  "Balochistan",
  "Khyber Pakhtunkhwa",
  "Gilgit Baltistan",
];

const PAYMENT_METHODS = [
  { value: "card", label: "Credit / Debit Card" },
  { value: "jazzCash", label: "JazzCash" },
  { value: "cashOnDelivery", label: "Cash on Delivery" },
] as const;

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const items = useAppSelector((state) => state.checkout.items);

  const { data: addresses = [], isLoading: addressesLoading } = useQuery<
    Address[]
  >({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      addressId: "",
      fullname: "",
      phone: "",
      province: "",
      city: "",
      street: "",
      paymentMethod: "",
    },
  });

  const addressChoice = useWatch({ control, name: "addressId" });
  const isAddingNew = addressChoice === "new" || addresses.length === 0;

  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const orderMutation = useMutation({
    mutationFn: createOrderApi,
    onSuccess: (order) => {
      dispatch(clearCheckout());
      dispatch(clearCart());
      toast.success("Order placed!");
      navigate(`/order/${order._id}`);
    },
    onError: () => toast.error("Couldn't place your order. Try again."),
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-white">
          Nothing to check out
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Your checkout session is empty.
        </p>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum: number, i: { price: number; quantity: number }) =>
      sum + i.price * i.quantity,
    0,
  );

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      let addressId = data.addressId;

      if (isAddingNew) {
        const newAddress = await addAddressMutation.mutateAsync({
          fullname: data.fullname,
          phone: data.phone,
          province: data.province,
          city: data.city,
          street: data.street,
        });
        addressId = newAddress._id;
      }

      orderMutation.mutate({
        items: items.map((i: { productId: string; quantity: number }) => ({
          product: i.productId,
          quantity: i.quantity,
        })),
        shippingAddress: addressId,
        paymentMethod: data.paymentMethod as
          | "jazzCash"
          | "card"
          | "cashOnDelivery",
      });
    } catch {
      toast.error("Couldn't save your address. Try again.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold text-white">Checkout</h1>

      <div className="mt-6 divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900">
        {items.map(
          (item: {
            productId: string;
            image: string;
            title: string;
            price: number;
            quantity: number;
          }) => (
            <div key={item.productId} className="flex items-center gap-4 p-4">
              <img
                src={item.image}
                alt={item.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Qty {item.quantity} · ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ),
        )}
      </div>

      <div className="mt-4 flex justify-between text-base font-semibold text-white">
        <span>Subtotal</span>
        <span className="text-violet-400">${subtotal.toFixed(2)}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-white">
            Delivery Address
          </h2>

          {addressesLoading ? (
            <p className="text-sm text-neutral-500">
              Loading saved addresses...
            </p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-colors has-checked:border-violet-500"
                >
                  <input
                    type="radio"
                    value={addr._id}
                    {...register("addressId", {
                      required: "Please select or add an address",
                    })}
                    className="mt-1 accent-violet-500"
                  />
                  <span className="text-sm text-neutral-300">
                    {addr.fullname} · {addr.phone} — {addr.street}, {addr.city},{" "}
                    {addr.province}
                  </span>
                </label>
              ))}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-colors has-checked:border-violet-500">
                <input
                  type="radio"
                  value="new"
                  {...register("addressId", {
                    required: "Please select or add an address",
                  })}
                  className="accent-violet-500"
                />
                <span className="text-sm text-neutral-300">
                  Use a new address
                </span>
              </label>
            </div>
          )}
          {errors.addressId && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.addressId.message}
            </p>
          )}

          {isAddingNew && (
            <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:grid-cols-2">
              <div>
                <input
                  {...register("fullname", {
                    required: "Full name is required",
                  })}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
                {errors.fullname && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <select
                  {...register("province", {
                    required: "Province is required",
                  })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                >
                  <option value="">Select province</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.province.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("city", { required: "City is required" })}
                  placeholder="City"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("street", {
                    required: "Street address is required",
                  })}
                  placeholder="Street address"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.street.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-white">
            Payment Method
          </h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-colors has-checked:border-violet-500"
              >
                <input
                  type="radio"
                  value={method.value}
                  {...register("paymentMethod", {
                    required: "Please select a payment method",
                  })}
                  className="accent-violet-500"
                />
                <span className="text-sm text-neutral-300">{method.label}</span>
              </label>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="submit"
            disabled={orderMutation.isPending || addAddressMutation.isPending}
            className="flex-1 rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {orderMutation.isPending ? "Placing Order..." : "Confirm Order"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/Games")}
            className="flex-1 rounded-lg border border-neutral-700 py-3 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
