"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Search,
  ShieldCheck,
  PackageSearch,
  HeartHandshake,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-2">
        {/* Left: Brand panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <ArrowLeft size={17} />
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500">
                <Search size={23} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Lost Item<span className="text-blue-400"> Network</span>
              </span>
            </Link>

            <div className="mt-20">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-blue-200">
                <ShieldCheck size={14} />
                Join your community
              </span>

              <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Every lost item
                <br />
                <span className="text-blue-400">deserves a way home.</span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                Create your account and become part of a community that helps
                people reconnect with their lost belongings.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 space-y-4">
            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <PackageSearch size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Report lost and found items
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Share item details to help others identify their belongings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <HeartHandshake size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold">Make a real difference</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Help build a more helpful and trustworthy community.
                </p>
              </div>
            </div>

            <p className="flex items-center gap-2 pt-2 text-xs text-slate-500">
              <CheckCircle2 size={15} className="text-blue-400" />A little help
              can mean a lot to someone.
            </p>
          </div>
        </section>

        {/* Right: Sign-up form */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600 lg:hidden"
            >
              <Search size={19} />
              Lost Item Network
            </Link>

            <div className="mb-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <User size={23} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create an account
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join Lost Item Network and help bring lost belongings home.
              </p>
            </div>

            <form className="space-y-4">
              {/* Full name */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                Create your account
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">ALREADY A MEMBER?</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Link
              href="/signin"
              className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              Sign in to your account
            </Link>

            <p className="mt-7 text-center text-xs leading-6 text-slate-400">
              By creating an account, you agree to use the platform responsibly
              and respect other community members.
            </p>

            <Link
              href="/"
              className="mt-4 block text-center text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
