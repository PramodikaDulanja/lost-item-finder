"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Search,
  ShieldCheck,
  MapPin,
  PackageSearch,
  ArrowLeft,
} from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-2">
        {/* Left: Brand section */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <ArrowLeft size={17} />
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500">
                <Search size={23} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Lost Item<span className="text-blue-400"> Network</span>
              </span>
            </Link>

            <div className="mt-20">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-blue-200">
                <ShieldCheck size={14} />
                Your community, connected
              </span>

              <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Lost something?
                <br />
                <span className="text-blue-400">Let’s find it together.</span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                Sign in to report lost belongings, share found items, and
                connect with people who can help reunite you with what matters.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <PackageSearch size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold">Report and discover</p>
                <p className="mt-1 text-xs text-slate-400">
                  Keep track of lost and found items.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Reconnect with your belongings
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Use item details and locations to help find a match.
                </p>
              </div>
            </div>

            <p className="pt-3 text-xs text-slate-500">
              Small acts of kindness can make a big difference.
            </p>
          </div>
        </section>

        {/* Right: Sign-in form */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600 lg:hidden"
            >
              <Search size={19} />
              Lost Item Network
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Lock size={23} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to your account to continue your journey.
              </p>
            </div>

            <form className="space-y-5">
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                Sign in to your account
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">
                NEW TO LOST ITEM NETWORK?
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Link
              href="/signup"
              className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              Create an account
            </Link>

            <p className="mt-8 text-center text-xs leading-6 text-slate-400">
              By signing in, you agree to use Lost Item Network responsibly and
              respect other community members.
            </p>

            <Link
              href="/"
              className="mt-5 block text-center text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
