"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, X, Plus } from "lucide-react";

export default function EditItemPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const { type, id } = resolvedParams;
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    item_name: "", category: "", description: "", location: "",
  });

  // Multiple Image States
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const categories = [
    "Electronics", "Bags & Accessories", "Keys", "Wallets & Cards", 
    "Documents", "Clothing", "Personal Items", "Other",
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else router.push("/signin");
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    async function fetchItemDetails() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/items/${type}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch item details");
        const data = await res.json();
        
        setFormData({
          item_name: data.item_name || data.itemName || "",
          category: data.category || "",
          description: data.description || "",
          location: data.location || "",
        });
        
        // Extract array of existing images
        if (data.image_urls && Array.isArray(data.image_urls)) {
          setExistingImages(data.image_urls);
        } else if (data.image) {
          setExistingImages([data.image]);
        }
        
      } catch (err) {
        setError("Could not load item details.");
      } finally {
        setLoading(false);
      }
    }
    fetchItemDetails();
  }, [type, id, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (urlToRemove: string) => {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const removeNewImage = (indexToRemove: number) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("item_name", formData.item_name);
      submitData.append("category", formData.category);
      submitData.append("location", formData.location);
      submitData.append("description", formData.description);
      
      // Pass the remaining existing URLs as a JSON string
      submitData.append("retained_images", JSON.stringify(existingImages));
      
      // Append all new files
      newImages.forEach((file) => {
        submitData.append("new_images", file);
      });

      const res = await fetch(`http://127.0.0.1:8000/api/items/${type}/${id}`, {
        method: "PUT",
        body: submitData,
      });

      if (!res.ok) throw new Error("Failed to update item");
      router.push("/my-items");
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Link href="/my-items" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition">
            <ArrowLeft size={16} /> Back to My Items
          </Link>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit {type === "lost" ? "Lost" : "Found"} Item</h1>

            {error && <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Multiple Image Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Item Images</label>
                
                <div className="flex flex-wrap gap-4">
                  {/* Render Existing Images */}
                  {existingImages.map((url, idx) => (
                    <div key={`exist-${idx}`} className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden group">
                      <img src={url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeExistingImage(url)} 
                        className="absolute top-1 right-1 bg-white/90 text-rose-600 p-1 rounded-full shadow-sm hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Render New Preview Images */}
                  {previewUrls.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative w-24 h-24 rounded-xl border-2 border-blue-200 overflow-hidden group">
                      <img src={url} alt={`New ${idx}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-white text-[10px] text-center font-semibold py-0.5">NEW</span>
                      <button 
                        type="button" 
                        onClick={() => removeNewImage(idx)} 
                        className="absolute top-1 right-1 bg-white/90 text-rose-600 p-1 rounded-full shadow-sm hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Add New Image Button */}
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition hover:border-blue-400">
                    <Plus className="text-slate-400 mb-1" size={24} />
                    <span className="text-[11px] font-medium text-slate-500">Add Image</span>
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleAddImages} />
                  </label>
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="item_name" className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                  <input type="text" id="item_name" name="item_name" required value={formData.item_name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition" />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select id="category" name="category" required value={formData.category} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition bg-white">
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input type="text" id="location" name="location" required value={formData.location} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea id="description" name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition resize-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link href="/my-items" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition">Cancel</Link>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}