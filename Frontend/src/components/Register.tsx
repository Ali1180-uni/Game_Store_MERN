import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type FormData = {
  Name: string;
  email: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
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
          Register to grab the latest drops and manage your orders.
        </p>
      </div>

      <div className="flex items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-6 text-xl font-semibold text-slate-900">
            Register
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="Name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="Name"
                {...register("Name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                placeholder="John Doe"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900
                 placeholder:text-slate-400 transition-colors
                 hover:border-slate-400
                 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.Name && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.Name.message}
                </p>
              )}
            </div>

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
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
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
                placeholder="••••••••"
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

            <button
              type="submit"
              className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white
               transition-colors hover:bg-violet-600
               focus:outline-none focus:ring-2 focus:ring-violet-500/50
               disabled:cursor-not-allowed disabled:opacity-60"
            >
              Register
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            <NavLink
              to="/login"
              className="font-medium text-violet-600 transition-colors hover:text-violet-700"
            >
              Already have an account? Log in here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
