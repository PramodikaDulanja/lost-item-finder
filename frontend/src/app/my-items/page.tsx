"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Trash2, MapPin, Calendar, Edit2, Search, Package, Plus,
  ArrowUpRight, ClipboardList, AlertCircle, CheckCircle2, Clock3, Layers3,
} from "lucide-react";

type Item = {
  id: number;
  type: "lost" | "found";
  itemName: string;
  category: string;
  location: string;
  date: string;
  image: string | null;
};

type FilterType = "all" | "lost" | "found";

export default function MyItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Existing API endpoint and response handling preserved.
  useEffect(() => {
    if (!userId) return;

    async function fetchMyItems() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/items`,
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyItems();
  }, [userId]);

  // Existing delete endpoint and local state update preserved.
  const handleDelete = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/items/${type}/${id}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setItems((prev) =>
          prev.filter((item) => item.id !== id || item.type !== type),
        );
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [item.itemName, item.category, item.location]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const lostCount = items.filter((item) => item.type === "lost").length;
  const foundCount = items.filter((item) => item.type === "found").length;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="text-sm font-medium text-slate-500">
              Loading your reported items...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!userId) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/70 px-4 py-16">
          <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <ClipboardList size={29} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Your items, all in one place
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to manage the items you have reported as lost or found.
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Sign in to continue <ArrowUpRight size={17} />
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <section className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-8 text-white shadow-xl shadow-blue-950/10 sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
                  <Layers3 size={14} /> PERSONAL DASHBOARD
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.65rem]">
                  My reported items
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
                  Keep track of your lost and found reports, update details, and
                  manage each report from one place.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/report-lost"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/20"
                >
                  <Plus size={17} /> Report lost item
                </Link>
                <Link
                  href="/report-found"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
                >
                  <Plus size={17} /> Report found item
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total reports</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{items.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Package size={23} /></div>
              </div>
              <p className="mt-3 text-xs text-slate-400">All your submitted reports</p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/70 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Lost reports</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{lostCount}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600"><AlertCircle size={23} /></div>
              </div>
              <p className="mt-3 text-xs text-slate-400">Items you are looking for</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Found reports</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{foundCount}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><CheckCircle2 size={23} /></div>
              </div>
              <p className="mt-3 text-xs text-slate-400">Items reported as found</p>
            </div>
          </section>

          <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Your reports</h2>
                <p className="mt-1 text-sm text-slate-500">Browse, search, and manage your submissions.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block sm:min-w-[260px]">
                  <span className="sr-only">Search your reports</span>
                  <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search name, category, location..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </label>
                <div className="flex rounded-xl bg-slate-100 p-1">
                  {([
                    { value: "all", label: "All" },
                    { value: "lost", label: "Lost" },
                    { value: "found", label: "Found" },
                  ] as const).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter(option.value)}
                      aria-pressed={filter === option.value}
                      className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                        filter === option.value
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {filteredItems.length === 0 ? (
            <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center sm:py-20">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                {items.length === 0 ? <Package size={29} /> : <Search size={27} />}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {items.length === 0 ? "No reports yet" : "No matching reports"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {items.length === 0
                  ? "When you report a lost or found item, it will appear here so you can manage it easily."
                  : "Try another search term or change the selected filter."}
              </p>
              {items.length === 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/report-lost" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"><Plus size={16} /> Report lost item</Link>
                  <Link href="/report-found" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><Plus size={16} /> Report found item</Link>
                </div>
              )}
            </section>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-800">{filteredItems.length}</span> {filteredItems.length === 1 ? "report" : "reports"}
                </p>
                <span className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:inline-flex"><Clock3 size={14} /> Manage your reports</span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <article
                    key={`${item.type}-${item.id}`}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                  >
                    <Link
                      href={`/item/${item.type}/${item.id}`}
                      className="relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50 focus:outline-none focus:ring-4 focus:ring-inset focus:ring-blue-200"
                      aria-label={`View details for ${item.itemName}`}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.itemName} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 shadow-sm"><Package size={26} /></div>
                          <span className="text-xs font-medium">No image available</span>
                        </div>
                      )}
                      <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold capitalize shadow-sm backdrop-blur ${
                        item.type === "lost" ? "border-rose-100 bg-white/95 text-rose-700" : "border-emerald-100 bg-white/95 text-emerald-700"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${item.type === "lost" ? "bg-rose-500" : "bg-emerald-500"}`} />
                        {item.type} item
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{item.category || "Uncategorized"}</p>
                        <h3 className="line-clamp-2 break-words text-lg font-bold leading-snug tracking-tight text-slate-900 transition group-hover:text-blue-700">{item.itemName || "Unnamed item"}</h3>
                      </div>

                      <div className="mb-5 space-y-2.5">
                        <div className="flex min-w-0 items-start gap-2.5 text-sm text-slate-500">
                          <MapPin size={16} className="mt-0.5 shrink-0 text-blue-600" />
                          <span className="break-words leading-5">{item.location || "Location not provided"}</span>
                        </div>
                        <div className="flex min-w-0 items-start gap-2.5 text-sm text-slate-500">
                          <Calendar size={16} className="mt-0.5 shrink-0 text-violet-600" />
                          <span className="break-words leading-5">
                            {item.date ? new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "Date not provided"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                        <Link href={`/item/${item.type}/${item.id}`} className="inline-flex items-center gap-1.5 rounded-lg py-2 text-sm font-bold text-blue-700 transition hover:text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100">
                          View details <ArrowUpRight size={16} />
                        </Link>
                        <div className="flex items-center gap-1">
                          <Link href={`/edit-item/${item.type}/${item.id}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100" title="Edit item" aria-label={`Edit ${item.itemName}`}>
                            <Edit2 size={17} />
                          </Link>
                          <button type="button" onClick={() => handleDelete(item.type, item.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-100" title="Delete item" aria-label={`Delete ${item.itemName}`}>
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
