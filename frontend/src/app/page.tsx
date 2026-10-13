"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Backpack,
  CheckCircle2,
  Clock3,
  FlaskConical,
  HeartHandshake,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  HelpCircle,
  FolderOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FilterType = "All" | "lost" | "found";

// This matches the data structure returning from your FastAPI backend
interface BackendItem {
  id: number;
  type: "lost" | "found";
  itemName: string;
  category: string;
  location: string;
  date: string;
  image: string | null;
  description?: string; // Optional since the feed might not include it yet
}

// Helper to match your beautiful gradients and icons to the dynamic database categories
function getCategoryDesign(category: string): {
  icon: LucideIcon;
  iconStyle: string;
  coverStyle: string;
} {
  const cat = category.toLowerCase();

  if (cat.includes("bag")) {
    return {
      icon: Backpack,
      iconStyle: "bg-white/90 text-amber-700",
      coverStyle: "from-amber-100 via-orange-50 to-stone-100",
    };
  } else if (cat.includes("electronic") || cat.includes("phone")) {
    return {
      icon: Smartphone,
      iconStyle: "bg-white/90 text-sky-700",
      coverStyle: "from-sky-100 via-blue-50 to-indigo-100",
    };
  } else if (cat.includes("key")) {
    return {
      icon: KeyRound,
      iconStyle: "bg-white/90 text-violet-700",
      coverStyle: "from-violet-100 via-purple-50 to-slate-100",
    };
  } else if (cat.includes("personal") || cat.includes("clothing")) {
    return {
      icon: FlaskConical,
      iconStyle: "bg-white/90 text-emerald-700",
      coverStyle: "from-emerald-100 via-teal-50 to-cyan-100",
    };
  } else if (cat.includes("document")) {
    return {
      icon: FolderOpen,
      iconStyle: "bg-white/90 text-rose-700",
      coverStyle: "from-rose-100 via-red-50 to-orange-100",
    };
  }

  // Default fallback style
  return {
    icon: HelpCircle,
    iconStyle: "bg-white/90 text-slate-700",
    coverStyle: "from-slate-100 via-gray-50 to-zinc-100",
  };
}

const filters: { label: string; value: FilterType }[] = [
  { label: "All Reports", value: "All" },
  { label: "Lost Items", value: "lost" },
  { label: "Found Items", value: "found" },
];

export default function Home() {
  const [items, setItems] = useState<BackendItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    // Fetch live data from your Neon PostgreSQL database
    async function fetchItems() {
      try {
        const res = await fetch("http://localhost:8000/api/items");
        // const res = await fetch("http://127.0.0.1:8000/api/items");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter =
        activeFilter === "All" || item.type === activeFilter;

      const searchableText = [
        item.itemName,
        item.category,
        item.location,
        item.type,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = query === "" || searchableText.includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [items, activeFilter, searchQuery]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8fafc] text-slate-900">
        <div className="w-full space-y-16 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-12">
          {/* Hero Section */}
          <section className="relative isolate overflow-hidden rounded-[2rem] bg-slate-950 shadow-xl shadow-slate-200/70">
            {/* Decorative background */}
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 left-1/3 -z-10 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl"
            />

            <div className="grid items-center gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-14 lg:py-20">
              <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-medium text-blue-200">
                  <Sparkles size={16} />A smarter way to reunite belongings
                </div>

                <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Lost something?
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                    Let&apos;s find it.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  Report lost belongings, discover found items, and connect
                  reports that might belong together. Every small clue can make
                  a difference.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/report-lost"
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Report a Lost Item
                    <ArrowUpRight
                      size={18}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>

                  <Link
                    href="/report-found"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    Report a Found Item
                    <ArrowRight size={18} />
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={17} className="text-emerald-400" />
                    Community-powered
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <HeartHandshake size={17} className="text-blue-400" />
                    Built to reconnect
                  </span>
                </div>
              </div>

              {/* Hero information panel */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        The power of a small clue
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-white">
                        Better connections
                      </h2>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                      <Sparkles size={22} />
                    </div>
                  </div>

                  <div className="mt-7 space-y-3">
                    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                        <Backpack size={25} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">
                          Lost belongings
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Share a description and location
                        </p>
                      </div>

                      <ArrowDownRight size={19} className="text-slate-500" />
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-medium text-blue-200">
                        <Sparkles size={14} />
                        Find possible connections
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                        <CheckCircle2 size={25} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">
                          Found belongings
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Help items find their owners
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                    Report details, compare clues, and help bring belongings
                    back to their owners.
                  </p>
                </div>

                <div className="absolute -bottom-5 -right-2 hidden items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-xl sm:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Every report matters
                    </p>
                    <p className="text-xs text-slate-500">
                      Powered by the community
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent reports */}
          <section id="recent-reports">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Explore the network
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Recent item reports
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  Discover reported belongings and possible matches.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "report" : "reports"} shown
              </span>
            </div>

            {/* Search and filters */}
            <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search items, categories, locations..."
                  aria-label="Search item reports"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div
                className="flex flex-wrap items-center gap-2"
                aria-label="Filter reports"
              >
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    aria-pressed={activeFilter === filter.value}
                    className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                      activeFilter === filter.value
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Item cards */}
            {loading ? (
              <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <p className="text-slate-500">
                  Loading reports from database...
                </p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => {
                  const {
                    icon: ItemIcon,
                    iconStyle,
                    coverStyle,
                  } = getCategoryDesign(item.category);
                  const isLost = item.type === "lost";

                  return (
                    <Link
                      href={`/item/${item.type}/${item.id}`}
                      key={`${item.type}-${item.id}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      {/* Item Image or Gradient Cover */}
                      <div
                        className={`relative flex h-52 items-center justify-center overflow-hidden ${
                          item.image
                            ? "bg-slate-100"
                            : `bg-gradient-to-br ${coverStyle}`
                        }`}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.itemName}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <>
                            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-white/60" />
                            <div className="absolute -bottom-14 -left-8 h-40 w-40 rounded-full border border-white/60" />
                            <div
                              className={`relative flex h-24 w-24 items-center justify-center rounded-[2rem] shadow-lg shadow-slate-900/5 transition duration-300 group-hover:scale-105 ${iconStyle}`}
                            >
                              <ItemIcon size={43} strokeWidth={1.5} />
                            </div>
                          </>
                        )}

                        <div className="absolute left-4 top-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                              isLost
                                ? "border-rose-200 bg-white/95 text-rose-700"
                                : "border-emerald-200 bg-white/95 text-emerald-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isLost ? "bg-rose-500" : "bg-emerald-500"
                              }`}
                            />
                            {item.type}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow-sm transition group-hover:opacity-100">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>

                      {/* Item information */}
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-medium text-slate-400">
                          {item.category}
                        </p>

                        <h3 className="mt-2 truncate text-lg font-bold tracking-tight text-slate-900">
                          {item.itemName}
                        </h3>

                        <p className="mt-2 min-h-[40px] text-sm leading-5 text-slate-500 line-clamp-2">
                          {item.description ||
                            "Click to view full item details and description."}
                        </p>

                        <div className="mt-auto space-y-3 border-t border-slate-100 pt-4">
                          <div className="flex items-start gap-2.5 text-sm text-slate-500">
                            <MapPin
                              size={17}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />
                            <span className="line-clamp-2">
                              {item.location}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 text-sm text-slate-500">
                            <Clock3
                              size={17}
                              className="shrink-0 text-slate-400"
                            />
                            <span>
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-sm font-semibold text-slate-700">
                            View report
                          </span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition group-hover:bg-blue-500 group-hover:text-white">
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Search size={25} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  No matching reports found
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try another keyword or change your filter to explore more lost
                  and found reports.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                  className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Clear search and filters
                </button>
              </div>
            )}
          </section>

          {/* Bottom call to action */}
          <section className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-violet-50">
            <div className="flex flex-col gap-6 px-6 py-9 sm:px-9 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Found something that belongs to someone?
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Share the details and help someone recover an important
                  belonging.
                </p>
              </div>

              <Link
                href="/report-found"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-700"
              >
                Report a Found Item
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>

          {/* How it works */}
          <section>
            <div className="mb-7 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Simple by design
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                A little information goes a long way.
              </h2>
              <p className="mt-3 leading-7 text-slate-500">
                Make reporting and discovering missing belongings
                straightforward for everyone.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Search size={23} />
                </div>
                <h3 className="mt-5 font-semibold">Search reports</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Explore lost and found reports using item names, categories,
                  and locations.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <Sparkles size={23} />
                </div>
                <h3 className="mt-5 font-semibold">Compare possible matches</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Use item details, images, and location information to identify
                  reports worth checking.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <HeartHandshake size={23} />
                </div>
                <h3 className="mt-5 font-semibold">Reconnect belongings</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Use the details in a report to help verify an item and arrange
                  a safe return.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-200 py-6">
            <div className="flex flex-col gap-3 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p>
                © {currentYear} Lost Item Network. Built to bring belongings
                back home.
              </p>
              <p className="flex items-center justify-center gap-2">
                <ShieldCheck size={16} />
                Community-powered item recovery
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
