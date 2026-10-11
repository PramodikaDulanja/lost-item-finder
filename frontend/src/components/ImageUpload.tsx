"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Prevents Next.js SSR from throwing hydration or random-value errors with Cloudinary
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = (result: any) => {
    if (result.info.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  return (
    <div className="w-full">
      {/* Thumbnail Previews */}
      {value.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-4">
          {value.map((url) => (
            <div
              key={url}
              className="relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
            >
              <Image
                fill
                sizes="112px"
                style={{ objectFit: "cover" }}
                alt="Uploaded item"
                src={url}
              />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white backdrop-blur transition hover:bg-red-600 shadow-sm"
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button (Hides when 5 images are reached) */}
      {value.length < 5 && (
        <CldUploadWidget
          onSuccess={onUpload}
          uploadPreset="lost_item_preset"
          options={{
            maxFiles: 5 - value.length, // Only allow the remaining slots
            resourceType: "image",
            clientAllowedFormats: ["jpeg", "png", "jpg", "webp"],
          }}
        >
          {({ open }) => {
            const onClick = (e: React.MouseEvent) => {
              e.preventDefault();
              open();
            };

            return (
              <button
                type="button"
                onClick={onClick}
                className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 ${
                  value.length > 0 ? "h-28" : "h-64"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                  <ImagePlus size={22} />
                </div>
                {value.length === 0 ? (
                  <div className="text-center">
                    <p className="text-sm font-semibold">
                      Click to upload images
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      PNG, JPG, or WEBP (Max 5 files)
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-semibold">
                    Add more photos ({value.length}/5)
                  </p>
                )}
              </button>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
}
