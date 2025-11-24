"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";

export default function HomeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) router.push("/repository");
    } catch (e) {}
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) throw new Error("API base URL missing");

      const url = `${baseUrl}/api/v1/plasmida/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 400) {
          setMessage({ type: "error", text: "Invalid email or password. Please try again." });
        } else if (response.status === 404) {
          setMessage({ type: "error", text: "Account not found. Please sign up first." });
        } else {
          setMessage({ type: "error", text: "Something went wrong. Please try again." });
        }
        return;
      }

      const token = data?.data?.tokens?.token;
      if (!token) {
        setMessage({ type: "error", text: "Account not found. Please Signup" });
        return;
      }

      localStorage.setItem("token", token);
      setMessage({ type: "success", text: "Login successful! Redirecting..." });
      setTimeout(() => router.push("/repository"), 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      setMessage({
        type: "error",
        text:
          err?.message?.includes("Failed to fetch") ||
          err?.message?.includes("NetworkError")
            ? "Network error. Please check your connection."
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-r from-white via-sky-50 to-white overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-36 top-6 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-36 bottom-6 h-80 w-80 rounded-full bg-sky-100/40 blur-3xl"
      />

      <section className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-sm bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center mx-4">
        <div className="mx-auto mb-4 w-fit rounded-full bg-white p-2 ring-1 ring-slate-200 shadow-sm">
          <Image
            src="/images/logo.png"
            alt="PLASMIDA crest"
            width={84}
            height={84}
            className="rounded-full"
            priority
          />
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-0">
          Welcome to PLASMIDA TrainMaster
        </h1>
        <p className="text-sm text-slate-500 mt-2 mb-6">Sign in to continue</p>

        <button
          type="button"
          className="flex h-11 items-center justify-center w-full gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
        >
          <span className="font-semibold  text-slate-700">Manange Reports</span>
        </button>

        <div className="flex items-center my-5">
          <hr className="flex-1 border-slate-200" />
          <span className="px-3 text-slate-400 text-xs"></span>
          <hr className="flex-1 border-slate-200" />
        </div>


        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-center">
            <span className="text-sm text-slate-500 mb-2 inline-block">Email</span>
            <div className="mx-auto max-w-full">
              <div className="flex h-11 items-center gap-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3">
                <FiMail className="text-slate-400 text-lg" aria-hidden />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  autoComplete="email"
                  required
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="text-sm text-slate-500 mb-2 inline-block">Password</span>
            <div className="mx-auto max-w-full">
              <div className="relative flex h-11 items-center gap-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3">
                <FiLock className="text-slate-400 text-lg" aria-hidden />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400 pr-10"
                  autoComplete="current-password"
                  required
                />
                {/* Eye toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
            </div>
          </div>

          {/* MESSAGE */}
          {message && (
            <p
              className={`text-sm text-center ${
                message.type === "error" ? "text-red-500" : "text-green-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 rounded-xl font-semibold text-white transition ${
              loading ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-black"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <a href="#" className="hover:underline text-slate-600">
              Forgot password?
            </a>
            <p className="text-slate-600">
              Need an account?{" "}
              <Link href="/signup" className="font-medium text-slate-900 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
