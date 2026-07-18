import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import img from "../../public/images/Title icon.png";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Home", path: "/GameVault" },
  { label: "Games", path: "/GameVault/Games" },
  { label: "Accessories", path: "/GameVault/Accessories" },
  { label: "About", path: "/GameVault/About" },
  { label: "Login", path: "/GameVault/login" },
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] w-full flex items-center justify-between px-6 md:px-10 py-4 bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800">
      <NavLink
        to="/GameVault"
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;