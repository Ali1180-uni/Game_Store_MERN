import { useQuery } from "@tanstack/react-query";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StarRateIcon from "@mui/icons-material/StarRate";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import StatCard from "./statCard";
import { fetchAdminStats } from "../Api/api";
import { useAppSelector, useAppDispatch } from "../Redux/hook";
import { logout } from "../Redux/AuthSlice/AuthSlice";
import { useNavigate, NavLink, Outlet, useMatch } from "react-router-dom";
import toast from "react-hot-toast";

const TABS = [
  { path: "", label: "Overview", icon: <DashboardIcon fontSize="small" /> },
  { path: "users", label: "Users", icon: <PeopleIcon fontSize="small" /> },
  { path: "products", label: "Products", icon: <Inventory2Icon fontSize="small" /> },
  { path: "orders", label: "Orders", icon: <ReceiptLongIcon fontSize="small" /> },
  { path: "user-reviews", label: "Reviews", icon: <StarRateIcon fontSize="small" /> },
  { path: "notifications", label: "Notifications", icon: <NotificationsIcon fontSize="small" /> },
];

const TAB_META: Record<string, { title: string; subtitle: string }> = {
  "": { title: "Overview", subtitle: "A snapshot of your store, right now." },
  users: { title: "Users", subtitle: "Manage employee accounts and access." },
  products: { title: "Products", subtitle: "Add, edit, and manage your catalog." },
  orders: { title: "Orders", subtitle: "Track and update order status." },
  "user-reviews": { title: "Reviews", subtitle: "Moderate reviews left by customers." },
  notifications: { title: "Notifications", subtitle: "Send a message to a specific user." },
};

const Admin = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isOverview = useMatch("/Admin");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
    enabled: !!isOverview,
  });

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/");
  };

  const activePath = TABS.find((t) =>
    t.path === "" ? isOverview : location.pathname.endsWith(t.path)
  )?.path ?? "";
  const meta = TAB_META[activePath];

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-black">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 px-4 py-6 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
            G
          </div>
          <span className="text-base font-bold text-white">GameVault Admin</span>
        </div>

        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
          Menu
        </p>
        <nav className="space-y-1">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === ""}
              className={({ isActive }) =>
                `flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`
              }
            >
              {tab.icon}
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-neutral-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            <LogoutIcon fontSize="small" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-neutral-800 bg-neutral-950/95 px-2 py-2 backdrop-blur-sm md:hidden">
        {TABS.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === ""}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-violet-400" : "text-neutral-500"
              }`
            }
          >
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Main column */}
      <div className="min-w-0 flex-1 pb-20 md:pb-0">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 md:px-8">
          <div>
            <h1 className="text-xl font-bold text-white">{meta.title}</h1>
            <p className="mt-0.5 text-sm text-neutral-500">{meta.subtitle}</p>
          </div>

          {user && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6 md:px-8">
          {isOverview ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Users" value={stats?.userCount} loading={isLoading} icon={<PeopleIcon />} />
              <StatCard label="Products" value={stats?.productCount} loading={isLoading} icon={<Inventory2Icon />} />
              <StatCard label="Orders" value={stats?.orderCount} loading={isLoading} icon={<ReceiptLongIcon />} />
              <StatCard label="Reviews" value={stats?.reviewCount} loading={isLoading} icon={<StarRateIcon />} />
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;