import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../Api/Admin.api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

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

const GAME_TYPES = ["Action", "RPG", "Sports", "Racing", "Strategy", "Shooter", "Adventure", "Simulation"];
const PLATFORMS = ["PlayStation 5", "PlayStation 4", "Xbox Series X", "Xbox One", "PC", "Nintendo Switch"];

const AddProduct = () => {
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
      price: 0,
      category: "",
      stock: 0,
      gameType: "",
      preOrder: "",
      preOrderReleaseDate: "",
      platform: "",
      brand: "",
    },
  });

  const isPreOrder = useWatch({ control, name: "preOrder" }) === "true";

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product created");
      reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to create product");
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    const imageFile = data.image?.[0];
    if (!imageFile) {
      toast.error("Image is required");
      return;
    }

    const payload = new FormData();
    payload.append("title", data.title);
    payload.append("description", data.description);
    payload.append("image", imageFile);
    payload.append("price", String(Number(data.price)));
    payload.append("category", data.category);
    payload.append("stock", String(Number(data.stock)));
    payload.append(
      "details",
      JSON.stringify([
        {
          gameType: data.gameType,
          preOrder: data.preOrder === "true",
          preOrderReleaseDate: data.preOrder === "true" ? data.preOrderReleaseDate : null,
          platform: data.platform,
          brand: data.brand,
        },
      ])
    );

    createMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Add Product</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <option value="">Select category</option>
            <option value="Game">Game</option>
            <option value="Accessories">Accessories</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={3}
            className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Product Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Price ($)</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Price is required", min: { value: 0, message: "Must be 0 or more" } })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Stock (max 20)</label>
          <input
            type="number"
            {...register("stock", {
              required: "Stock is required",
              min: { value: 0, message: "Must be 0 or more" },
              max: { value: 20, message: "Max stock is 20" },
            })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
          {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Game Type</label>
          <select
            {...register("gameType", { required: "Game type is required" })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <option value="">Select type</option>
            {GAME_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.gameType && <p className="mt-1 text-sm text-red-500">{errors.gameType.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Platform</label>
          <select
            {...register("platform", { required: "Platform is required" })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <option value="">Select platform</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.platform && <p className="mt-1 text-sm text-red-500">{errors.platform.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Brand</label>
          <input
            {...register("brand", { required: "Brand is required" })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
          {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Pre-Order</label>
          <select
            {...register("preOrder", { required: "Required" })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <option value="">Select</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
          {errors.preOrder && <p className="mt-1 text-sm text-red-500">{errors.preOrder.message}</p>}
        </div>

        {isPreOrder && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Release Date</label>
            <input
              type="date"
              {...register("preOrderReleaseDate", { required: isPreOrder ? "Release date required for pre-orders" : false })}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
            {errors.preOrderReleaseDate && (
              <p className="mt-1 text-sm text-red-500">{errors.preOrderReleaseDate.message}</p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
      >
        {createMutation.isPending ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
};

export default AddProduct;