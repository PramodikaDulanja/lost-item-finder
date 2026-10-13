"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  X,
  Plus,
  MapPin,
  FileText,
  Package,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Sparkles,
} from "lucide-react";

type FormDataState = {
  item_name: string;
  category: string;
  description: string;
  location: string;
};


export default function EditItemPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = use(params);
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormDataState>({
    item_name: "",
    category: "",
    description: "",
    location: "",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const categories = [
    "Electronics",
    "Bags & Accessories",
    "Keys",
    "Wallets & Cards",
    "Documents",
    "Clothing",
    "Personal Items",
    "Other",
  ];

  const itemType = type === "lost" ? "Lost" : "Found";
  const isLost = type === "lost";
  const totalImages = existingImages.length + newImages.length;

  // Authentication
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setAuthReady(true);
      } else {
        setUserId(null);
        router.replace("/signin");
      }
    });

    return unsubscribe;
  }, [router]);

  // Load item information
  useEffect(() => {
    if (!authReady || !userId) return;

    let cancelled = false;

    async function fetchItemDetails() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/items/${type}/${id}`
        );

        if (!res.ok) {
          throw new Error("Unable to load this item.");
        }

        const data = await res.json();

        if (cancelled) return;

        // Optional ownership check, provided by the API.
        // The backend must also enforce ownership on update.
        if (data.user_id && data.user_id !== userId) {
          throw new Error("You cannot edit this item.");
        }

        setFormData({
          item_name: data.item_name || data.itemName || "",
          category: data.category || "",
          description: data.description || "",
          location: data.location || "",
        });

        if (Array.isArray(data.image_urls)) {
          setExistingImages(data.image_urls);
        } else if (data.image) {
          setExistingImages([data.image]);
        } else {
          setExistingImages([]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load item details."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchItemDetails();

    return () => {
      cancelled = true;
    };
  }, [authReady, userId, type, id]);

  // Release browser-created image previews when replaced or removed.
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess(false);
  };

  const handleAddImages = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.currentTarget;
    const selected = Array.from(input.files || []);

    // Allow selecting the same file again later.
    input.value = "";

    if (!selected.length) return;

    const remainingSlots = 6 - totalImages;

    if (remainingSlots <= 0) {
      setError("You can upload a maximum of 6 images.");
      return;
    }

    const validImages = selected.filter((file) =>
      file.type.startsWith("image/")
    );

    const accepted = validImages
      .filter((file) => file.size <= 5 * 1024 * 1024)
      .slice(0, remainingSlots);

    const messages: string[] = [];

    if (validImages.length !== selected.length) {
      messages.push("Only image files are accepted.");
    }

    if (validImages.some((file) => file.size > 5 * 1024 * 1024)) {
      messages.push("Each image must be 5 MB or smaller.");
    }

    if (accepted.length < validImages.length) {
      messages.push("A maximum of 6 images is allowed.");
    }

    if (messages.length) setError(messages.join(" "));

    if (!accepted.length) return;

    setNewImages((prev) => [...prev, ...accepted]);
    setPreviewUrls((prev) => [
      ...prev,
      ...accepted.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((image) => image !== url));
    setError("");
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));

    setPreviewUrls((prev) => {
      const removedUrl = prev[index];

      if (removedUrl) URL.revokeObjectURL(removedUrl);

      return prev.filter((_, i) => i !== index);
    });

    setError("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (saving) return;

    if (!userId) {
      setError("Please sign in before saving your changes.");
      return;
    }

    if (totalImages === 0) {
      setError("Please keep or upload at least one item image.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const submitData = new FormData();

      submitData.append("item_name", formData.item_name.trim());
      submitData.append("category", formData.category);
      submitData.append("location", formData.location.trim());
      submitData.append("description", formData.description.trim());
      submitData.append(
        "retained_images",
        JSON.stringify(existingImages)
      );

      newImages.forEach((file) => {
        submitData.append("new_images", file);
      });

      const res = await fetch(
        `http://127.0.0.1:8000/api/items/${type}/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: submitData,
        }
      );

      if (!res.ok) {
        const result = await res.json().catch(() => null);

        throw new Error(
          result?.detail ||
            result?.message ||
            "Failed to save your changes."
        );
      }

      setSuccess(true);
      router.push("/my-items");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setSaving(false);
    }
  };

  if (!authReady || loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Loader2 className="animate-spin text-indigo-600" size={26} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-800">
                Loading item details
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Preparing your editing workspace...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
        {/* Page heading */}
        <section className="border-b border-slate-200/80 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
            <Link
              href="/my-items"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to My Items
            </Link>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Package size={24} />
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isLost
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {itemType} item
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <ShieldCheck size={13} />
                      Edit your report
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Edit item details
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Keep your report accurate. Updated descriptions and
                    clear photos can help people identify your item.
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:flex">
                <Sparkles size={17} className="text-indigo-500" />
                <span>Help your item get noticed</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
              {/* Main form */}
              <div className="space-y-6">
                {/* Images card */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-900">
                          Item photos
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                          Add clear photos from different angles.
                        </p>
                      </div>
                    </div>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                      {totalImages}/6
                    </span>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {existingImages.map((url, idx) => (
                        <div
                          key={`${url}-${idx}`}
                          className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={url}
                            alt={`Existing item photo ${idx + 1}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />

                          <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                            Current photo
                          </span>

                          <button
                            type="button"
                            aria-label={`Remove existing image ${idx + 1}`}
                            onClick={() => removeExistingImage(url)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}

                      {previewUrls.map((url, idx) => (
                        <div
                          key={url}
                          className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-indigo-200 bg-indigo-50"
                        >
                          <img
                            src={url}
                            alt={`New item photo ${idx + 1}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />

                          <span className="absolute bottom-2 left-2 rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white">
                            NEW PHOTO
                          </span>

                          <button
                            type="button"
                            aria-label={`Remove new image ${idx + 1}`}
                            onClick={() => removeNewImage(idx)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}

                      {totalImages < 6 && (
                        <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-4 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50">
                          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                            <Plus size={21} />
                          </span>
                          <span className="text-sm font-semibold text-slate-700">
                            Add photos
                          </span>
                          <span className="mt-1 text-[11px] text-slate-400">
                            Up to 5 MB each
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleAddImages}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3.5">
                      <ShieldCheck
                        size={16}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />
                      <p className="text-xs leading-5 text-slate-500">
                        Use photos that clearly show the item. Avoid
                        including private documents, addresses, or
                        sensitive information in your pictures.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Item details card */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Item information
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Update the details of your report.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 p-5 sm:p-7">
                    <div>
                      <label
                        htmlFor="item_name"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Item name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="item_name"
                        name="item_name"
                        type="text"
                        required
                        maxLength={100}
                        value={formData.item_name}
                        onChange={handleChange}
                        placeholder="e.g. Black Nike backpack"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                      <p className="mt-2 text-xs text-slate-400">
                        Use a clear, recognizable name.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="category"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Category <span className="text-rose-500">*</span>
                        </label>
                        <select
                          id="category"
                          name="category"
                          required
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        >
                          <option value="" disabled>
                            Select category
                          </option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="location"
                          className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700"
                        >
                          <MapPin size={15} className="text-slate-400" />
                          Location <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          required
                          maxLength={200}
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. University cafeteria"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                          htmlFor="description"
                          className="text-sm font-semibold text-slate-700"
                        >
                          Description{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-xs text-slate-400">
                          {formData.description.length}/1000
                        </span>
                      </div>

                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={5}
                        maxLength={1000}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the item's color, brand, distinctive features, or other useful details..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        Specific details can help the matching system
                        identify similar lost and found reports.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Error and success messages */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
                  >
                    <AlertCircle size={19} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Unable to save changes</p>
                      <p className="mt-1 leading-5">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
                  >
                    <CheckCircle2 size={19} />
                    Your changes have been saved.
                  </div>
                )}

                {/* Desktop actions */}
                <div className="hidden items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex">
                  <Link
                    href="/my-items"
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={saving || !formData.item_name.trim() || !formData.category || !formData.location.trim() || !formData.description.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right sidebar */}
              <aside className="space-y-5 lg:sticky lg:top-6">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="font-semibold text-slate-900">
                      Report overview
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Review your current details.
                    </p>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                        Report type
                      </p>
                      <span
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                          isLost
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isLost ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                        />
                        {itemType} item
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                        Item name
                      </p>
                      <p className="break-words text-sm font-semibold text-slate-800">
                        {formData.item_name || "Not provided"}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                        Category
                      </p>
                      <p className="text-sm text-slate-700">
                        {formData.category || "Not selected"}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                        Photos
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <ImageIcon size={16} className="text-indigo-500" />
                        {totalImages} of 6 images
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    Improve your match chances
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Accurate descriptions, recognizable photos, and
                    specific locations help people identify your item.
                  </p>
                </section>

                <div className="flex items-start gap-2 px-1 text-xs leading-5 text-slate-400">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0" />
                  <p>
                    Only edit reports you own. Your backend should verify
                    ownership before accepting updates.
                  </p>
                </div>
              </aside>
            </div>

            {/* Mobile actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:hidden">
              <Link
                href="/my-items"
                className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving || !formData.item_name.trim() || !formData.category || !formData.location.trim() || !formData.description.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}