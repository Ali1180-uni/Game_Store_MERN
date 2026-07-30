import { AnimatePresence, motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../Redux/hook";
import { useAppDispatch } from "../Redux/hook";
import { clearCart, removeItem } from "../Redux/CartSlice/cartSlice";

const CartBar = () => {
  const count = useAppSelector((state) => state.cart.count);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex items-center gap-4 rounded-full border border-neutral-700 bg-neutral-900/95 px-5 py-3 shadow-[0_0_30px_rgba(139,92,246,0.2)] backdrop-blur-sm">
            <div className="relative">
              <ShoppingCartIcon className="text-white" fontSize="small" />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {count}
              </span>
            </div>
            <span className="text-sm text-neutral-300">
              {count} item{count !== 1 ? "s" : ""} in cart
            </span>
            <button
              onClick={() => dispatch(removeItem())}
              className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
             <RemoveIcon /> Remove Item
            </button>
            <button
              onClick={() => dispatch(clearCart())}
              className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
            <RemoveShoppingCartIcon /> Clear Cart
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
            >
              <ShoppingBagIcon />  View Cart
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartBar;
