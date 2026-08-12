import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useMutation } from "@tanstack/react-query";
import { registerUser, sendOtp, verifyOtp } from "../Api/api";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (step !== "otp") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [step]);

  const sendOtpMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      setOtpToken(data.otpToken);
      setTimeLeft(60);
      setStep("otp");
      toast.success("Verification code sent to your email");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to send verification code",
      );
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      if (pendingData) registerMutation.mutate(pendingData);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Invalid code");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created!");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message ??
          "Registration failed. Please try again.",
      );
    },
  });

  const onSubmitForm = (data: FormData) => {
    setPendingData(data);
    sendOtpMutation.mutate(data.email);
  };

  const onVerify = () => {
    if (otpValue.length !== 6 || !pendingData) return;
    verifyOtpMutation.mutate({
      email: pendingData.email,
      otp: otpValue,
      otpToken,
    });
  };

  const handleResend = () => {
    if (!pendingData) return;
    sendOtpMutation.mutate(pendingData.email);
    setOtpValue("");
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
          {step === "form" ? (
            <>
              <h1 className="mb-6 text-xl font-semibold text-slate-900">
                Register
              </h1>

              <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900
                     placeholder:text-slate-400 transition-colors hover:border-slate-400
                     focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.name.message}
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
                     placeholder:text-slate-400 transition-colors hover:border-slate-400
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
                  <div className="relative">
                    <input
                      id="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm text-slate-900
       placeholder:text-slate-400 transition-colors hover:border-slate-400
       focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={sendOtpMutation.isPending}
                  className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white
                   transition-colors hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50
                   disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendOtpMutation.isPending ? "Sending code..." : "Continue"}
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
            </>
          ) : (
            <>
              <h1 className="mb-2 text-xl font-semibold text-slate-900">
                Verify your email
              </h1>
              <p className="mb-6 text-sm text-slate-600">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium">{pendingData?.email}</span>
              </p>

              <input
                value={otpValue}
                onChange={(e) =>
                  setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                disabled={timeLeft === 0}
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-center text-2xl tracking-[0.5em] text-slate-900
                 placeholder:text-slate-300 transition-colors hover:border-slate-400
                 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-3 flex items-center justify-between text-sm">
                <span
                  className={timeLeft === 0 ? "text-red-600" : "text-slate-500"}
                >
                  {timeLeft > 0 ? `Expires in ${timeLeft}s` : "Code expired"}
                </span>
                {timeLeft === 0 && (
                  <button
                    onClick={handleResend}
                    disabled={sendOtpMutation.isPending}
                    className="font-medium text-violet-600 hover:text-violet-700 disabled:opacity-60"
                  >
                    {sendOtpMutation.isPending ? "Sending..." : "Resend code"}
                  </button>
                )}
              </div>

              <button
                onClick={onVerify}
                disabled={
                  otpValue.length !== 6 ||
                  timeLeft === 0 ||
                  verifyOtpMutation.isPending ||
                  registerMutation.isPending
                }
                className="mt-5 w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white
                 transition-colors hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50
                 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {verifyOtpMutation.isPending || registerMutation.isPending
                  ? "Verifying..."
                  : "Verify & Create Account"}
              </button>

              <button
                onClick={() => setStep("form")}
                className="mt-3 w-full text-center text-sm text-slate-500 hover:text-slate-700"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
