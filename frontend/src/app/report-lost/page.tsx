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
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function ReportLostPage() {
  // Form State
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateLost, setDateLost] = useState("");
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

    const user = auth.currentUser;

    if (!user) {
      setMessage("Error: You must be logged in to submit a report.");
      setLoading(false);
      return;
    }

    const formData = {
      userId: user.uid,
      itemName,
      category,
      description,
      location,
      dateLost, 
      imageUrls,
      // contact_number is removed here; backend auto-fills it from the users table
    };

    try {
      const response = await fetch("http://localhost:8000/api/items/lost", {
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
      router.push(`/item/lost/${data.id}`);

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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700">
              <Search size={15} />
              FIND YOUR BELONGING
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Lost something?
              <span className="block text-blue-600">
                Let's get it back to you.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Provide as many details as possible. The more specific you are, the easier it will be for the community to identify and return your item.
            </p>
          </div>

          <div className="grid items-start gap-7 lg:grid-cols-[1fr_320px]">
            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-6 sm:px-9">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Search size={24} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Lost item details
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Complete the fields below to prepare your report.
                    </p>
                  </div>
                </div>
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
                        placeholder="e.g. Black backpack, silver phone, car keys"
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
                        <option value="Bags & Accessories">Bags & Accessories</option>
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
                        Detailed description <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        minLength={10}
                        maxLength={1000}
                        rows={4}
                        placeholder="Describe what you lost, including brand, color, scratches, or unique features..."
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                      02
                    </span>
                    <h3 className="font-bold text-slate-900">Where and when?</h3>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="location" className={labelClass}>
                        Last known location <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3.5 top-[26px] text-slate-400" />
                        <input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                          maxLength={200}
                          placeholder="e.g. University library, Bus route 120"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="dateLost" className={labelClass}>
                        Date and time lost <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock3 size={18} className="absolute left-3.5 top-[26px] text-slate-400" />
                        <input
                          id="dateLost"
                          type="datetime-local"
                          value={dateLost}
                          onChange={(e) => setDateLost(e.target.value)}
                          required
                          max={maxDateTime}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
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
                    If you have an old photo of the item, uploading it can significantly improve the chances of it being recognized.
                  </p>

                  <ImageUpload
                    value={imageUrls}
                    onChange={(url) => setImageUrls((prev) => [...prev, url])}
                    onRemove={(urlToRemove) =>
                      setImageUrls((prev) => prev.filter((u) => u !== urlToRemove))
                    }
                  />
                </div>

                {message && (
                  <div
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
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-70"
                  >
                    {loading ? "Submitting..." : "Submit Lost Report"}
                    {!loading && <ArrowRight size={17} />}
                  </button>
                </div>
              </form>
            </section>

            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg shadow-slate-200/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-rose-300">
                  <ShieldCheck size={25} />
                </div>
                <h2 className="mt-5 text-lg font-bold">Tips for finding your item</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                    <p className="text-sm leading-6 text-slate-300">Provide an exact location if you know where you lost it.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                    <p className="text-sm leading-6 text-slate-300">Keep an eye on the "Found Items" browse section.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}