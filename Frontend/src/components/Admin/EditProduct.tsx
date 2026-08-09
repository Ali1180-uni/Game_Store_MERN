import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchAdminProducts,
  updateProduct,
  updateProductStock,
  deleteProduct,
  type AdminProduct,
} from "../../Api/Admin.api";
import toast from "react-hot-toast";

const MAX_STOCK = 20;
const GAME_TYPES = [
  "Action",
  "RPG",
  "Sports",
  "Racing",
  "Strategy",
  "Shooter",
  "Adventure",
  "Simulation",
];
const PLATFORMS = [
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X",
  "Xbox One",
  "PC",
  "Nintendo Switch",
];

type ProductFormValues = {
  title: string;
  description: string;
  image?: FileList;
  price: number;
  category: "Game" | "Accessories" | "";
  stock: number;
  gameType: string;
  preOrder: "true" | "false" | "";
  preOrderReleaseDate: string;
  platform: string;
  brand: string;
};

const EditProduct = () => {
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState<"" | "Game" | "Accessories">("");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(
    null,
  );
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(
    null,
  );

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchAdminProducts,
  });

  const filteredProducts = useMemo(
    () =>
      categoryFilter
        ? products.filter((product) => product.category === categoryFilter)
        : products,
    [products, categoryFilter],
  );

  const stockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      updateProductStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Stock updated");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update stock");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product deleted");
      setDeletingProduct(null);
    },
  });

  if (isLoading)
    return <p className="text-sm text-neutral-500">Loading products...</p>;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-white">Manage Products</h2>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-neutral-300">Category</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as "" | "Game" | "Accessories")}
          className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <option value="">All Categories</option>
          <option value="Game">Game</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filteredProducts.map((p) => (
              <tr key={p._id} className="text-neutral-300">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <span className="max-w-40 truncate">{p.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    max={MAX_STOCK}
                    defaultValue={p.stock}
                    onBlur={(e) => {
                      const parsed = Number(e.target.value);
                      if (!Number.isFinite(parsed)) {
                        e.target.value = String(p.stock);
                        return;
                      }
                      const value = Math.trunc(
                        Math.min(MAX_STOCK, Math.max(0, parsed)),
                      );
                      e.target.value = String(value);
                      if (value !== p.stock)
                        stockMutation.mutate({ id: p._id, stock: value });
                    }}
                    className="w-16 rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.isAvailable
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {p.isAvailable ? "Available" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => setDeletingProduct(p)}
                      className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center">
            <h3 className="text-lg font-semibold text-white">
              Delete this product?
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              This will permanently delete{" "}
              <span className="text-white">{deletingProduct.title}</span>. This
              can't be undone.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                onClick={() => deleteMutation.mutate(deletingProduct._id)}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeletingProduct(null)}
                className="flex-1 rounded-lg border border-neutral-700 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EditProductModal = ({
  product,
  onClose,
}: {
  product: AdminProduct;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const detail = product.details[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProductFormValues>({
    defaultValues: {
      title: product.title,
      description: product.description,
      image: undefined,
      price: product.price,
      category: product.category,
      stock: product.stock,
      gameType: detail?.gameType ?? "",
      preOrder: detail?.preOrder ? "true" : "false",
      preOrderReleaseDate: detail?.preOrderReleaseDate
        ? detail.preOrderReleaseDate.slice(0, 10)
        : "",
      platform: detail?.platform ?? "",
      brand: detail?.brand ?? "",
    },
  });

  const isPreOrder = useWatch({ control, name: "preOrder" }) === "true";

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => updateProduct(product._id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product updated");
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update product");
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    const payload = new FormData();
    payload.append("title", data.title);
    payload.append("description", data.description);
    payload.append("price", String(Number(data.price)));
    payload.append("category", data.category);
    payload.append("stock", String(Number(data.stock)));
    payload.append(
      "details",
      JSON.stringify([
        {
          gameType: data.gameType,
          preOrder: data.preOrder === "true",
          preOrderReleaseDate:
            data.preOrder === "true" ? data.preOrderReleaseDate : null,
          platform: data.platform,
          brand: data.brand,
        },
      ]),
    );

    const imageFile = data.image?.[0];
    if (imageFile) {
      payload.append("image", imageFile); // new file — backend uploads & replaces
    } else {
      payload.append("image", product.image); // no new file — backend keeps this URL as-is
    }

    updateMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="text-lg font-semibold text-white">Edit Product</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Title
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                <option value="Game">Game</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={3}
                className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Product Image{" "}
                <span className="text-neutral-500">
                  (leave empty to keep current)
                </span>
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Must be 0 or more" },
                })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Stock (max 20)
              </label>
              <input
                type="number"
                {...register("stock", {
                  required: "Stock is required",
                  min: { value: 0, message: "Must be 0 or more" },
                  max: { value: 20, message: "Max stock is 20" },
                })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stock.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Game Type
              </label>
              <select
                {...register("gameType", { required: "Game type is required" })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                {GAME_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Platform
              </label>
              <select
                {...register("platform", { required: "Platform is required" })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Brand
              </label>
              <input
                {...register("brand", { required: "Brand is required" })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.brand && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Pre-Order
              </label>
              <select
                {...register("preOrder", { required: "Required" })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            {isPreOrder && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                  Release Date
                </label>
                <input
                  type="date"
                  {...register("preOrderReleaseDate", {
                    required: isPreOrder
                      ? "Release date required for pre-orders"
                      : false,
                  })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
                {errors.preOrderReleaseDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.preOrderReleaseDate.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-neutral-700 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
