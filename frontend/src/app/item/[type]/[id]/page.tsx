"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  Share2,
  Copy,
  ChevronRight,
  ChevronLeft,
  Phone, 
  MessageCircle,
} from "lucide-react";

export default function ItemDetailsPage() {
  const params = useParams();
  const type = params?.type as string;
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!type || !id) return;
    
    async function fetchItem() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/items/${type}/${id}`);
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
  }, [type, id]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: item?.item_name || "Lost Item Network",
          text: "Help find this item on Lost Item Network.",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Sharing was cancelled or is unavailable.
    }
  };

  const nextImage = () => {
    if (!item?.image_urls?.length) return;
    setCurrentImageIndex((prev: number) =>
      prev === item.image_urls.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    if (!item?.image_urls?.length) return;
    setCurrentImageIndex((prev: number) =>
      prev === 0 ? item.image_urls.length - 1 : prev - 1,
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading item details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <ImageIcon size={26} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            We couldn&apos;t find this item
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              "This item may have been removed or the link may be incorrect."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
            Return to items
          </Link>
        </div>
      </main>
    );
  }

  const isFoundItem = type === "found";
  const displayType = isFoundItem ? "Found" : "Lost";
  const rawDate = isFoundItem ? item.date_found : item.date_lost;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const formattedDate =
    dateObj && !Number.isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date not provided";
  const formattedTime =
    dateObj && !Number.isNaN(dateObj.getTime())
      ? dateObj.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Time not provided";
  const hasImages = Boolean(item.image_urls?.length);
  const safeImageIndex = hasImages
    ? Math.min(currentImageIndex, item.image_urls.length - 1)
    : 0;

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Breadcrumb and actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg py-1 font-medium text-slate-500 transition hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              <span>Back to items</span>
            </Link>
            <ChevronRight size={15} className="text-slate-300" />
            <span className="truncate font-semibold text-slate-800">
              Item details
            </span>
          </nav>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            {copied ? <Copy size={16} /> : <Share2 size={16} />}
            {copied ? "Link copied" : "Share item"}
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          {/* Main content */}
          <div className="min-w-0 space-y-6">
            {/* Image gallery */}
            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="relative flex aspect-[4/3] max-h-[600px] min-h-[260px] items-center justify-center overflow-hidden bg-slate-100 sm:aspect-[16/10] sm:min-h-[380px] lg:aspect-[16/9]">
                {hasImages ? (
                  <>
                    <img
                      src={item.image_urls[safeImageIndex]}
                      alt={`${item.item_name} - Image ${safeImageIndex + 1}`}
                      className="h-full w-full object-contain"
                    />
                    {item.image_urls.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-800 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white sm:left-5 sm:h-11 sm:w-11"
                        >
                          <ChevronLeft size={21} />
                        </button>
                        <button
                          type="button"
                          onClick={nextImage}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-800 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white sm:right-5 sm:h-11 sm:w-11"
                        >
                          <ChevronRight size={21} />
                        </button>
                        <div className="absolute bottom-4 right-4 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                          {safeImageIndex + 1} / {item.image_urls.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 px-6 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white bg-white text-slate-300 shadow-sm">
                      <ImageIcon size={36} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">
                      No photo provided
                    </p>
                    <p className="max-w-xs text-xs leading-5 text-slate-400">
                      There are no images attached to this item report.
                    </p>
                  </div>
                )}

                <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold shadow-sm backdrop-blur ${
                      isFoundItem
                        ? "border-emerald-100 bg-white/95 text-emerald-700"
                        : "border-rose-100 bg-white/95 text-rose-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isFoundItem ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {displayType} item
                  </span>
                </div>
              </div>

              {/* Image thumbnails */}
              {hasImages && item.image_urls.length > 1 && (
                <div className="flex gap-3 overflow-x-auto border-t border-slate-100 px-4 py-3.5 sm:px-5">
                  {item.image_urls.map((url: string, index: number) => (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={safeImageIndex === index}
                      className={`h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition sm:h-20 sm:w-20 ${
                        safeImageIndex === index
                          ? "border-blue-600 ring-2 ring-blue-100"
                          : "border-transparent opacity-70 hover:border-slate-300 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Item thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Item details */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.035)] sm:p-7 lg:p-8">
              <div className="border-b border-slate-100 pb-6">
                <span className="inline-flex max-w-full items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {item.category || "Uncategorized"}
                </span>
                <h1 className="mt-4 break-words text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-[2rem]">
                  {item.item_name || "Unnamed item"}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Details shared by the community
                </p>
              </div>

              <div className="py-6">
                <h2 className="text-base font-bold text-slate-900">
                  Description
                </h2>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {item.description || "No description provided."}
                </p>
              </div>

              {/* Contact Owner Section */}
              {item.contact_number && item.contact_number !== "Not provided" && (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2">Contact the Reporter</h3>
            
                  <p className="text-sm text-slate-500 mb-5">
                    If you have information about this item, reach out directly.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={`https://wa.me/${item.contact_number.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#20bd5a] transition shadow-sm shadow-green-500/20"
                    >
                      <MessageCircle size={18} />
                      Chat on WhatsApp
                    </a>

                    <a 
                      href={`tel:${item.contact_number}`} 
                      className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-800 transition shadow-sm shadow-slate-900/20"
                    >
                      <Phone size={18} />
                      Call Number
                    </a>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-6">
                <h2 className="mb-4 text-base font-bold text-slate-900">
                  {isFoundItem ? "Where it was found" : "Where it was lost"}
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-100">
                      <MapPin size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Location
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800">
                        {item.location || "Location not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-100">
                      <CalendarDays size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Date reported
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:col-span-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-100">
                      <Clock size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Approximate time
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                        {formattedTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Community notice */}
            <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 p-5 sm:p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                <ShieldCheck size={21} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Help reunite this item with its owner
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  If you recognize this item, use the relevant report option to
                  help connect the reports. Avoid sharing private information
                  publicly.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />
              <div className="p-5 sm:p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <Sparkles size={23} />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  Community action
                </p>
                <h2 className="mt-2 text-xl font-bold leading-snug tracking-tight text-slate-950">
                  {isFoundItem
                    ? "Is this your belonging?"
                    : "Have you found this item?"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {isFoundItem
                    ? "If you believe this item belongs to you, submit a lost report with details that can help compare the reports."
                    : "If you have found an item like this, submit a found report with its details to help its owner locate it."}
                </p>

                <Link
                  href={isFoundItem ? "/report-lost" : "/report-found"}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  {isFoundItem
                    ? "Report this as lost"
                    : "Submit a found report"}
                  <ChevronRight size={17} />
                </Link>

                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <p className="text-xs leading-5 text-slate-500">
                    Keep identifying details private so the rightful owner can
                    verify the item.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.035)] sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Stay safe
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    Arrange any handover in a safe public place. Never share
                    passwords, banking details, or other sensitive information.
                  </p>
                </div>
              </div>
            </section>

            <p className="px-2 text-center text-xs leading-5 text-slate-400">
              Lost Item Network · Helping belongings find their way home
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}