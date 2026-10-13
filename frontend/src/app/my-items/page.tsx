"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Trash2, MapPin, Calendar, Edit2 } from "lucide-react"; 

type Item = {
  id: number;
  type: "lost" | "found";
  itemName: string;
  category: string;
  location: string;
  date: string;
  image: string | null;
};

export default function MyItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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

  const handleDelete = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/items/${type}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) =>
          prev.filter((item) => item.id !== id || item.type !== type),
        );
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading)
    return <div className="p-20 text-center">Loading your items...</div>;
  if (!userId)
    return (
      <div className="p-20 text-center">Please log in to view your items.</div>
    );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">
            My Reported Items
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200">
              You haven't reported any items yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="h-40 bg-slate-100 relative">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-bold uppercase">
                      {item.type}
                    </span>
                  </div>
                  <div className="p-4 flex flex-1 flex-col">
                    <h3 className="font-bold text-lg">{item.itemName}</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      {item.category}
                    </p>
                    <div className="mt-auto flex justify-between items-center border-t border-slate-100 pt-4">
                      
                      <Link href={`/item/${item.type}/${item.id}`} className="text-blue-600 text-sm font-semibold hover:underline">
                        View Details
                      </Link>
                      
                      <div className="flex items-center gap-1">
                        <Link 
                          href={`/edit-item/${item.type}/${item.id}`} 
                          className="text-slate-400 p-2 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition"
                          title="Edit Item"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.type, item.id)} 
                          className="text-slate-400 p-2 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition"
                          title="Delete Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}