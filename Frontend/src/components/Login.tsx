import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../Api/api";
import { useAppDispatch } from "../Redux/hook";
import { setCredentials } from "../Redux/AuthSlice/AuthSlice";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const from = (location.state as { from?: string })?.from ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token, user: data.user }));
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    },
    onError: () => {
      const message = "Login failed. Check your email and password.";
      toast.error(message);
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="hidden flex-col items-center justify-center bg-black px-10 md:flex">
        <div className="w-full max-w-sm">
          <DotLottieReact
            src="https://lottie.host/8a262abb-b066-4720-9b7b-780d62cb4718/QEC1GEV4qQ.lottie"
            loop
            autoplay
          />
        </div>
        <h2 className="mt-6 bg-linear-to-r from-violet-400 via-fuchsia-300 to-sky-400 bg-clip-text text-2xl font-bold text-transparent">
          Game On
        </h2>
        <p className="mt-2 max-w-xs text-center text-sm text-neutral-400">
          Sign in to grab the latest drops and manage your orders.
        </p>
      </div>
      <div className="flex items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-6 text-xl font-semibold text-slate-900">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900
                       placeholder:text-slate-400 transition-colors
                       hover:border-slate-400
                       focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type="password"
                placeholder="password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900
         placeholder:text-slate-400 transition-colors
         hover:border-slate-400
         focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginMutation.isError && (
              <p className="text-sm text-red-600">
                Login failed. Check your email and password.
              </p>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white
                     transition-colors hover:bg-violet-600
                     focus:outline-none focus:ring-2 focus:ring-violet-500/50
                     disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            <NavLink
              to="/register"
              className="font-medium text-violet-600 transition-colors hover:text-violet-700"
            >
              Don't have an account? Register here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
