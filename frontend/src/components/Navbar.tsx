"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Search,
  Menu,
  X,
  PlusCircle,
  UserRound,
  ChevronDown,
  PackageSearch,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      closeMenu();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex h-[72px] items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md shadow-slate-900/10 transition group-hover:bg-blue-600">
              <Search size={21} strokeWidth={2.5} />
            </div>

            <div className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
                Lost Item
                <span className="text-blue-600"> Network</span>
              </span>
              <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
                Find what matters
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/#recent-items"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Browse Items
            </Link>

            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Report an Item
                <ChevronDown
                  size={15}
                  className="transition-transform group-hover:rotate-180"
                />
              </button>

              <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-900/10">
                  <Link
                    href="/report-lost"
                    className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-blue-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Search size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Lost an item?
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        Report something missing
                      </span>
                    </span>
                  </Link>

                  <Link
                    href="/report-found"
                    className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-emerald-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <PackageSearch size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Found an item?
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        Help return it to its owner
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-4 sm:flex">
            {!loading &&
              (user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700">
                    Hi, {user.displayName || "User"}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    <UserRound size={17} />
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition hover:bg-blue-600"
                  >
                    <PlusCircle size={17} />
                    Get Started
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 sm:hidden"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-lg sm:hidden">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/#recent-items"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
            >
              Browse Items
            </Link>

            <Link
              href="/report-lost"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <Search size={17} />
              Report a Lost Item
            </Link>

            <Link
              href="/report-found"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-600"
            >
              <PackageSearch size={17} />
              Report a Found Item
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            {!loading &&
              (user ? (
                <>
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                    <UserRound size={16} />
                    <span className="truncate">
                      {user.displayName || "User"}
                    </span>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <UserRound size={16} />
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    Get Started
                    <PlusCircle size={16} />
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}
