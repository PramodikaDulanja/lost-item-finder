"use client";

import Link from "next/link";
// 1. Import `use` from react
import { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  MessageCircle,
  Flag,
  Share2,
  Copy,
  Info,
  ChevronRight,
} from "lucide-react";

export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>; // 2. Type it as a Promise
}) {
  // 3. Unwrap the params using React.use()
  const resolvedParams = use(params);

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showContactMessage, setShowContactMessage] = useState(false);
  const [showReportMessage, setShowReportMessage] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      try {
        // 4. Use the unwrapped resolvedParams here
        const res = await fetch(
          `http://localhost:8000/api/items/${resolvedParams.type}/${resolvedParams.id}`,
        );
        if (!res.ok) throw new Error("Item not found");
        const data = await res.json();
        setItem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [resolvedParams.type, resolvedParams.id]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: item?.item_name || "Lost Item Network",
          text: `Help find this item on Lost Item Network.`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      // Sharing was cancelled or is unavailable.
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading item details...</p>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-rose-500">{error || "Item not found."}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  // Parse backend data using unwrapped params
  const isFoundItem = resolvedParams.type === "found";
  const displayType = isFoundItem ? "Found" : "Lost";
  const rawDate = isFoundItem ? item.date_found : item.date_lost;
  const dateObj = new Date(rawDate);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const imageUrl =
    item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to items
            </Link>
            <ChevronRight size={15} />
            <span className="text-slate-800">Item details</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
          >
            {copied ? <Copy size={16} /> : <Share2 size={16} />}
            {copied ? "Link copied" : "Share item"}
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            {/* Item image */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 sm:min-h-[430px]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.item_name}
                    className="h-full w-full object-cover max-h-[500px]"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white bg-white/80 text-slate-300 shadow-sm">
                      <ImageIcon size={44} strokeWidth={1.2} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        No photo provided
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute left-5 top-5">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wide shadow-sm ${isFoundItem ? "border-emerald-100 text-emerald-600" : "border-rose-100 text-rose-600"}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${isFoundItem ? "bg-emerald-500" : "bg-rose-500"}`}
                    />
                    {displayType} item
                  </span>
                </div>
              </div>
            </section>

            {/* Item information */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {item.category}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {item.item_name}
                  </h1>
                </div>
              </div>

              <div className="mb-7 border-b border-slate-100 pb-7">
                <h2 className="mb-3 text-sm font-bold text-slate-800">
                  Description
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>

              <h2 className="mb-4 text-sm font-bold text-slate-800">
                Last known details
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <MapPin size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <CalendarDays size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Date reported
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Clock size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Approximate time
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formattedTime}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Community notice */}
            <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-blue-600"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Help reunite this item with its owner
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  If you recognize this item, contact the relevant person
                  through the platform once messaging is enabled. Avoid sharing
                  private information publicly.
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Sparkles size={24} />
              </div>

              <h3 className="mb-2 text-base font-bold text-slate-900">
                {isFoundItem
                  ? "Is this your belonging?"
                  : "Did you find this item?"}
              </h3>

              <p className="mb-6 text-sm leading-6 text-slate-500">
                {isFoundItem
                  ? "Submit a lost report with your specific item details. Our AI will analyze your description and image to securely verify your ownership."
                  : "Submit a found report to help reunite this belonging with its owner. Our AI will verify the match before opening secure communication."}
              </p>

              <Link
                href={isFoundItem ? "/report-lost" : "/report-found"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {isFoundItem
                  ? "Submit a Lost Report to Verify"
                  : "Report as Found"}
              </Link>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Stay safe
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    Meet in a safe public place when returning belongings. Never
                    share passwords or financial information.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
