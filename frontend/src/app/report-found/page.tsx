"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/ImageUpload";
import { auth } from "@/lib/firebase";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Info,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";

export default function ReportFoundPage() {
  // Form State
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // UI State
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxDateTime, setMaxDateTime] = useState("");

  // Safely generate the current time only on the client
  useEffect(() => {
    setMaxDateTime(new Date().toISOString().slice(0, 16));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // 1. Get the current logged-in Firebase user
    // const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMessage("Error: You must be logged in to submit a report.");
      setLoading(false);
      return;
    }

    // 2. Attach the user's Firebase UID to the payload
    const formData = {
      userId: user.uid,
      itemName,
      category,
      description,
      location,
      dateLost: dateFound, // Mapped to the backend's expected field name
      imageUrls,
    };

    try {
      const response = await fetch("http://localhost:8000/api/items/found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit report");
      }

      const data = await response.json();
      console.log("Found Item Saved to Database:", data);
      router.push(`/item/found/${data.id}`);

      // Clear the form fields after successful save
      setItemName("");
      setCategory("");
      setDescription("");
      setLocation("");
      setDateFound("");
      setImageUrls([]);
    } catch (error: any) {
      console.error("Submission error:", error);
      setMessage(
        error.message ||
          "Failed to save report. Make sure your FastAPI backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const labelClass = "text-sm font-semibold text-slate-800";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <div className="mb-9">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700">
              <Package size={15} />
              HELP REUNITE AN ITEM
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Found something?
              <span className="block text-blue-600">
                Help it find its owner.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Share a few details about the item you found. Your report may help
              someone reconnect with a valuable belonging.
            </p>
          </div>

          <div className="grid items-start gap-7 lg:grid-cols-[1fr_320px]">
            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-6 sm:px-9">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Package size={24} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Found item details
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Complete the fields below to prepare your report.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-blue-600" />
                  <div className="h-1.5 flex-1 rounded-full bg-slate-100" />
                  <div className="h-1.5 flex-1 rounded-full bg-slate-100" />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Item information · Location · Photos
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-9">
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                      01
                    </span>
                    <h3 className="font-bold text-slate-900">About the item</h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="itemName" className={labelClass}>
                        Item name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="itemName"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                        maxLength={100}
                        placeholder="e.g. Black backpack, silver phone"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className={labelClass}>
                        Item category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className={`${inputClass} ${category ? "" : "text-slate-400"}`}
                      >
                        <option value="" disabled>
                          Select an item category
                        </option>
                        <option value="Electronics">Electronics</option>
                        <option value="Bags & Accessories">
                          Bags & Accessories
                        </option>
                        <option value="Keys">Keys</option>
                        <option value="Documents">Documents & Cards</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Jewelry">Jewelry & Watches</option>
                        <option value="Personal Items">Personal Items</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="description" className={labelClass}>
                        Detailed description{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <p className="mt-1.5 text-xs leading-5 text-slate-500">
                        Include the color, brand, condition, or other
                        identifying features. Keep unique identifying details
                        private where possible.
                      </p>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        minLength={10}
                        maxLength={1000}
                        rows={4}
                        placeholder="Describe what you found and any visible features..."
                        className={`${inputClass} resize-y`}
                      />
                      <p className="mt-2 text-right text-xs text-slate-400">
                        {description.length}/1000 characters
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                      02
                    </span>
                    <h3 className="font-bold text-slate-900">
                      Where and when?
                    </h3>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="location" className={labelClass}>
                        Location found <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin
                          size={18}
                          className="absolute left-3.5 top-[26px] text-slate-400"
                        />
                        <input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                          maxLength={200}
                          placeholder="e.g. University library"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        Name the building or public area.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="dateFound" className={labelClass}>
                        Date and time <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock3
                          size={18}
                          className="absolute left-3.5 top-[26px] text-slate-400"
                        />
                        <input
                          id="dateFound"
                          type="datetime-local"
                          value={dateFound}
                          onChange={(e) => setDateFound(e.target.value)}
                          required
                          max={maxDateTime}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        When did you find the item?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                      03
                    </span>
                    <h3 className="font-bold text-slate-900">Add a photo</h3>
                  </div>

                  <p className="mb-4 text-sm leading-6 text-slate-500">
                    A clear photo can help people recognize their belongings.
                    Avoid including personal documents or sensitive information.
                  </p>

                  <ImageUpload
                    value={imageUrls}
                    onChange={(url) => setImageUrls((prev) => [...prev, url])}
                    onRemove={(urlToRemove) =>
                      setImageUrls((prev) =>
                        prev.filter((u) => u !== urlToRemove),
                      )
                    }
                  />
                </div>

                <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 mt-8">
                  <Info size={19} className="mt-0.5 shrink-0 text-blue-600" />
                  <p className="text-xs leading-6 text-blue-900/80">
                    For everyone&apos;s safety, keep passwords, ID numbers,
                    addresses, and other sensitive information out of your
                    public report.
                  </p>
                </div>

                {message && (
                  <div
                    role="status"
                    className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${
                      message.includes("Error")
                        ? "border-rose-200 bg-rose-50 text-rose-900"
                        : "border-emerald-200 bg-emerald-50 text-emerald-900"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 mt-8 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <ArrowLeft size={17} />
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-70"
                  >
                    {loading ? "Submitting..." : "Submit Found Report"}
                    {!loading && <ArrowRight size={17} />}
                  </button>
                </div>
              </form>
            </section>

            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg shadow-slate-200/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
                  <ShieldCheck size={25} />
                </div>

                <h2 className="mt-5 text-lg font-bold">
                  Help safely and responsibly
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  A few simple precautions can protect the item and its rightful
                  owner.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />
                    <p className="text-sm leading-6 text-slate-300">
                      Describe the item honestly and accurately.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />
                    <p className="text-sm leading-6 text-slate-300">
                      Keep some unique details private for ownership
                      verification.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />
                    <p className="text-sm leading-6 text-slate-300">
                      Arrange a safe handover in an appropriate public place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <HeartHandshakeIcon />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Every report matters
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Small actions make a difference.
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <Link
                    href="/report-lost"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                  >
                    Looking for your item?
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
            Lost Item Network · Helping belongings find their way home.
          </footer>
        </div>
      </main>
    </>
  );
}

function HeartHandshakeIcon() {
  return <CheckCircle2 size={21} />;
}
