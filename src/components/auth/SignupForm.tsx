"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUsers, saveUsers, saveSession } from "@/lib/auth";
import { User } from "@/types/auth";
import { MdCheck } from "react-icons/md";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();
    if (users.find((u) => u.email === normalizedEmail)) {
      setError("User already exists");
      setLoading(false);
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    saveSession({ userId: newUser.id, email: newUser.email });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
            <MdCheck className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Create account
          </h1>
          <p className="text-zinc-300 mt-1 text-sm">
            Start building better habits today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-100 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              data-testid="auth-signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-zinc-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-100 mb-1.5"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                data-testid="auth-signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-zinc-600"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            data-testid="auth-signup-submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm tracking-wide mt-2"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
