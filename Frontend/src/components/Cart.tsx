import { NavLink, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAppSelector, useAppDispatch } from "../Redux/hook";
import { addItem, removeItem, deleteItem, clearCart } from "../Redux/CartSlice/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../Api/api";


const Cart = () => {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: games = [], isLoading: gamesLoading } = useQuery({
    queryKey: ["products", "Game"],
    queryFn: () => fetchProducts("Game"),
  });

  const { data: accessories = [], isLoading: accessoriesLoading } = useQuery({
    queryKey: ["products", "Accessory"],
    queryFn: () => fetchProducts("Accessory"),
  });

  const isLoading = gamesLoading || accessoriesLoading;

  const cartEntries = Object.entries(items)
    .map(([id, quantity]) => {
      const product = [...games, ...accessories].find((p) => String(p._id) === id);
      return product ? { ...product, quantity } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-neutral-400">Loading your cart...</p>
      </div>
    );
  }

  if (cartEntries.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <ShoppingCartIcon className="text-neutral-600" style={{ fontSize: 56 }} />
        <h1 className="mt-4 text-xl font-semibold text-white">Your cart is empty</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Looks like you haven't added any games yet.
        </p>
        <div className="mt-6 flex gap-3">
          <NavLink
            to="/Games"
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            Browse Games
          </NavLink>
          <NavLink
            to="/Accessories"
            className="rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
          >
            Browse Accessories
          </NavLink>
        </div>
      </div>
    );
  }

  const subtotal = cartEntries.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = () => {
    const orderId = nanoid();
    dispatch(clearCart());
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-white">Your Cart</h1>

        <div className="divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900">
          {cartEntries.map((item) => (
            <div key={item._id} className="flex items-center gap-4 p-4">
              <button
                onClick={() => dispatch(deleteItem(String(item._id)))}
                aria-label={`Remove ${item.title} from cart`}
                className="text-neutral-500 transition-colors hover:text-red-500"
              >
                <DeleteIcon fontSize="small" />
              </button>

              <img src={item.image} alt={item.title} className="h-16 w-16 rounded-lg object-cover" />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-400">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-neutral-700 px-2 py-1">
                <button
                  onClick={() => dispatch(removeItem(String(item._id)))}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-30"
                >
                  <RemoveIcon style={{ fontSize: 14 }} />
                </button>
                <span className="w-5 text-center text-sm text-white">{item.quantity}</span>
                <button
                  onClick={() => dispatch(addItem(String(item._id)))}
                  disabled={item.quantity >= 5}
                  aria-label="Increase quantity"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-30"
                >
                  <AddIcon style={{ fontSize: 14 }} />
                </button>
              </div>

              <p className="w-20 shrink-0 text-right text-sm font-semibold text-violet-400">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-lg font-semibold text-white">Order Summary</h2>

        <div className="mt-4 space-y-2.5 text-sm">
          <div className="flex justify-between text-neutral-400">
            <span>Items</span>
            <span>{cartEntries.reduce((sum, i) => sum + i.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between border-t border-neutral-800 pt-4 text-base font-semibold text-white">
          <span>Total</span>
          <span className="text-violet-400">${subtotal.toFixed(2)}</span>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handlePlaceOrder}
            className="w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
          >
            Place Order
          </button>
          <NavLink
            to="/Games"
            className="w-full rounded-lg border border-neutral-700 py-3 text-center text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
          >
            Cancel
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Cart;