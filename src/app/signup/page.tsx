"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiLock, FiMail } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // 👈 added

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 👇 added for eye toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirm) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/v1/plasmida/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setMessage(data.message || "❌ Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-r from-white via-sky-50 to-white overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -left-36 top-6 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-36 bottom-6 h-80 w-80 rounded-full bg-sky-100/40 blur-3xl" />

      <section className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:underline"
          >
            <FiArrowLeft className="text-base" aria-hidden />
            Back to sign in
          </Link>
        </div>

        <div className="mx-auto my-4 w-fit rounded-full bg-white p-2 ring-1 ring-slate-200 shadow-sm">
          <Image
            src="/images/logo.png"
            alt="PLASMIDA crest"
            width={68}
            height={68}
            className="rounded-full"
            priority
          />
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Create your account
        </h2>

        <form className="space-y-4 mt-2" onSubmit={handleSignup}>
          {/* Email */}
          <div className="text-left">
            <span className="text-sm text-slate-500 mb-2 inline-block">Email</span>
            <div className="flex h-11 items-center gap-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3">
              <FiMail className="text-slate-400 text-lg" aria-hidden />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                autoComplete="email"
                aria-label="Email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="text-left">
            <span className="text-sm text-slate-500 mb-2 inline-block">Password</span>
            <div className="flex h-11 items-center gap-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3">
              <FiLock className="text-slate-400 text-lg" aria-hidden />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                autoComplete="new-password"
                aria-label="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          <div className="text-left">
            <span className="text-sm text-slate-500 mb-2 inline-block">Confirm Password</span>
            <div className="flex h-11 items-center gap-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3">
              <FiLock className="text-slate-400 text-lg" aria-hidden />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                autoComplete="new-password"
                aria-label="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-slate-500"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 rounded-xl font-semibold text-white transition ${
              loading ? "bg-slate-500 cursor-not-allowed" : "bg-slate-900 hover:bg-black"
            }`}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          {/* Message */}
          {message && (
            <p
              className={`text-sm text-center mt-3 ${
                message.includes("✅")
                  ? "text-green-600"
                  : message.includes("❌") || message.includes("⚠️")
                  ? "text-red-500"
                  : "text-slate-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
