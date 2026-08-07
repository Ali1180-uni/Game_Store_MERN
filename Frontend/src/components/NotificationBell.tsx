import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markNotificationRead } from "../Api/api";
import { useAppSelector } from "../Redux/hook";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: fetchNotifications,
    enabled: !!token,
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
        aria-label="Notifications"
      >
        <NotificationsIcon
          fontSize="small"
          className="text-gray-600 dark:text-neutral-300"
        />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 max-h-96 w-80 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <p className="text-sm font-semibold text-black dark:text-white">
                Notifications
              </p>
            </div>

            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-neutral-500">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => !n.isRead && markReadMutation.mutate(n._id)}
                  className={`block w-full border-b border-neutral-200 px-4 py-3 text-left transition-colors last:border-b-0 dark:border-neutral-800 ${
                    n.isRead
                      ? "opacity-60 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      : "bg-violet-50 hover:bg-violet-100 dark:bg-violet-500/5 dark:hover:bg-violet-500/10"
                  }`}
                >
                  <p className="text-sm font-medium text-black dark:text-white">
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                    {n.message}
                  </p>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
