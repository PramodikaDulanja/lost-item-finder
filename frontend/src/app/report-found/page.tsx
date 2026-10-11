"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  FileImage,
  Info,
  MapPin,
  Package,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

export default function ReportFoundPage() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!photo) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Demo only: connect Firebase and Cloudinary to save reports.
    setMessage(
      "Your form is ready, but this demo does not save reports yet. Connect Firebase and Cloudinary to enable submissions.",
    );
  }

  function handlePhotoChange(file: File | undefined) {
    setMessage("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Please choose an image smaller than 5 MB.");
      return;
    }

    setPhoto(file);
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const labelClass = "text-sm font-semibold text-slate-800";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Back navigation */}
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          {/* Page heading */}
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
            {/* Main form */}
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
                  Item information · Location · Photo
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-9">
                {/* Item information */}
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

                {/* Location and time */}
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
                          max={new Date().toISOString().slice(0, 16)}
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

                {/* Image upload */}
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

                  <label
                    htmlFor="photo"
                    className="group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
                  >
                    {previewUrl ? (
                      <div className="w-full">
                        <img
                          src={previewUrl}
                          alt="Preview of the found item"
                          className="mx-auto max-h-64 max-w-full rounded-xl object-contain"
                        />
                        <p className="mt-4 break-all text-sm font-medium text-slate-700">
                          {photo?.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Click to choose a different photo
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 transition group-hover:scale-105">
                          <Camera size={26} />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-800">
                          Click to upload or choose a photo
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          PNG, JPG or WEBP · Maximum 5 MB
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                          <Upload size={16} />
                          Choose image
                        </span>
                      </>
                    )}
                  </label>

                  <input
                    id="photo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                  />

                  {photo && (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileImage
                          size={20}
                          className="shrink-0 text-blue-600"
                        />
                        <span className="truncate text-sm text-slate-600">
                          {photo.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPhoto(null)}
                        aria-label="Remove selected photo"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Notice */}
                <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
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
                    className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
                  >
                    {message}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <ArrowLeft size={17} />
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    Prepare Found Report
                    <ArrowRight size={17} />
                  </button>
                </div>

                <p className="text-center text-xs leading-5 text-slate-400">
                  Your report will not be saved until backend integration is
                  implemented.
                </p>
              </form>
            </section>

            {/* Sidebar */}
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
