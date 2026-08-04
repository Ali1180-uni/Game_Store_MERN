import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import img from "../../public/images/Title icon.png";
import { useAppSelector, useAppDispatch } from "../Redux/hook";
import { logout } from "../Redux/AuthSlice/AuthSlice.ts";
import toast from "react-hot-toast";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Games", path: "/Games" },
  { label: "Accessories", path: "/Accessories" },
  { label: "About", path: "/About" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useAppSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 w-full flex items-center justify-between px-6 md:px-10 bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800">
      <NavLink
        to="/"
        className="flex items-center gap-2 text-lg font-bold text-black dark:text-white shrink-0"
      >
        <img src={img} alt="GameVault Logo" className="w-8 h-8" />
        GameVault
      </NavLink>

      <div className="hidden md:flex items-center gap-8 ml-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {item.label}
            </NavLink>
          );
        })}

        {token ? (
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/login"
                ? "text-black dark:text-white"
                : "text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Login
          </NavLink>
        )}
      </div>

      <button
        className="md:hidden text-black dark:text-white ml-auto"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 flex flex-col gap-1 py-4 px-6 md:hidden z-50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium py-2 transition-colors ${
                  isActive
                    ? "text-black dark:text-white"
                    : "text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}

          {token ? (
            <button
              onClick={handleLogout}
              className="text-left text-sm font-medium py-2 text-gray-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-2 text-gray-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;