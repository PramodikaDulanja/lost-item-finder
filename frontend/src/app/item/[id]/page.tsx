"use client";

import Link from "next/link";
import { useState } from "react";
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
  params: { id: string };
}) {
  const [showContactMessage, setShowContactMessage] = useState(false);
  const [showReportMessage, setShowReportMessage] = useState(false);
  const [copied, setCopied] = useState(false);

  const item = {
    id: params.id,
    name: "Black Nike Backpack",
    type: "Lost", // Standardized to match page.tsx
    category: "Bags & Accessories",
    description:
      "Black canvas backpack with a small red Nike logo on the front pocket. It may contain a laptop charger and a notebook. The bag was last seen near the university cafeteria.",
    location: "University Cafeteria",
    date: "October 8, 2026",
    time: "2:30 PM",
    match: 92,
    imageSimilarity: 60,
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.name,
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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
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

        {/* Main layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Item image */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 sm:min-h-[430px]">
                {/* Replace this placeholder with the actual item image */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white bg-white/80 text-slate-300 shadow-sm">
                    <ImageIcon size={44} strokeWidth={1.2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Item photo
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      The uploaded image will appear here
                    </p>
                  </div>
                </div>

                <div className="absolute left-5 top-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-red-600 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {item.type} item
                  </span>
                </div>

                <div className="absolute bottom-5 right-5">
                  <span className="rounded-lg border border-white/80 bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
                    Item ID: {item.id}
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
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      <Sparkles size={13} />
                      Possible match found
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {item.name}
                  </h1>
                </div>
              </div>

              <div className="mb-7 border-b border-slate-100 pb-7">
                <h2 className="mb-3 text-sm font-bold text-slate-800">
                  Description
                </h2>
                <p className="text-sm leading-7 text-slate-600">
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
                      {item.date}
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
                      {item.time}
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
            {/* Conditional AI Panel / Public Report Prompt */}
            {(() => {
              // Mock variable: Change to `true` to see the AI match card
              const hasRelatedReport = false;
              const isFoundItem = item.type === "Found"; // Standardized to match type

              if (hasRelatedReport) {
                return (
                  <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-slate-950 p-6 text-white">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                          <Sparkles size={19} />
                        </div>
                        <span className="text-sm font-semibold text-slate-200">
                          Smart match analysis
                        </span>
                      </div>

                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold tracking-tight">
                          {item.match}%
                        </span>
                        <span className="mb-1 text-sm font-medium text-blue-300">
                          similarity
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        This is a potential match based on the example image,
                        description, location, and time data.
                      </p>

                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                          style={{ width: `${item.match}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="mb-5 text-sm font-bold text-slate-800">
                        Matching signals
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            size={19}
                            className="mt-0.5 shrink-0 text-emerald-500"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              Image similarity
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Example image similarity score:{" "}
                              {item.imageSimilarity}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            size={19}
                            className="mt-0.5 shrink-0 text-emerald-500"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              Description similarity
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              The item descriptions may share identifying
                              details.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            size={19}
                            className="mt-0.5 shrink-0 text-emerald-500"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              Location and time
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Compare the reported locations and timestamps to
                              estimate whether the reports are related.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3">
                        <Info
                          size={17}
                          className="mt-0.5 shrink-0 text-amber-600"
                        />
                        <p className="text-xs leading-5 text-amber-800">
                          Similarity scores are estimates, not proof of
                          ownership. Confirm item details before arranging a
                          return.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowContactMessage(true)}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                      >
                        <MessageCircle size={18} />
                        Contact item reporter
                      </button>

                      {showContactMessage && (
                        <p
                          role="status"
                          className="mt-3 rounded-xl bg-blue-50 p-3 text-sm leading-5 text-blue-700"
                        >
                          Messaging is not connected yet. Add Firebase
                          Authentication and a messaging or contact workflow to
                          enable this feature.
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowReportMessage(true)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Flag size={17} />
                        Report incorrect listing
                      </button>

                      {showReportMessage && (
                        <p
                          role="status"
                          className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-5 text-slate-600"
                        >
                          Reporting is not connected yet. Add a report form and
                          backend moderation workflow to submit this listing for
                          review.
                        </p>
                      )}
                    </div>
                  </section>
                );
              }

              return (
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
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
              );
            })()}

            {/* Additional information (Always visible) */}
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
