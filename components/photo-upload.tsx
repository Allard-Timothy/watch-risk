"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
  CLAIMED_PHOTO_TYPES,
  PHOTO_TYPE_LABELS,
  RECOMMENDED_PHOTO_AREAS,
  providedDetectedTypes,
  type ClaimedPhotoType,
} from "@/lib/photos";
import { cn } from "@/lib/utils";

export type DraftPhoto = Readonly<{
  id: string;
  fileName: string;
  url: string;
  claimedType: ClaimedPhotoType | "";
}>;

type PhotoUploadProps = Readonly<{
  onProvidedTypesChange?: (types: ReturnType<typeof providedDetectedTypes>) => void;
}>;

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function PhotoUpload({ onProvidedTypesChange }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<DraftPhoto[]>([]);
  const objectUrls = useRef<string[]>([]);
  const inputId = useId();

  useEffect(() => {
    onProvidedTypesChange?.(
      providedDetectedTypes(photos.map((photo) => photo.claimedType)),
    );
  }, [photos, onProvidedTypesChange]);

  useEffect(() => {
    return () => {
      for (const url of objectUrls.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  function addFiles(fileList: FileList | null) {
    if (!fileList) {
      return;
    }
    const next: DraftPhoto[] = [];
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith("image/")) {
        continue;
      }
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      next.push({
        id: newId(),
        fileName: file.name,
        url,
        claimedType: "",
      });
    }
    if (next.length > 0) {
      setPhotos((current) => [...current, ...next]);
    }
  }

  function updateType(id: string, claimedType: ClaimedPhotoType | "") {
    setPhotos((current) =>
      current.map((photo) =>
        photo.id === id ? { ...photo, claimedType } : photo,
      ),
    );
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        objectUrls.current = objectUrls.current.filter(
          (url) => url !== target.url,
        );
      }
      return current.filter((photo) => photo.id !== id);
    });
  }

  const provided = providedDetectedTypes(
    photos.map((photo) => photo.claimedType),
  );
  const providedSet = new Set(provided);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm text-muted-foreground">
          {provided.length} of {RECOMMENDED_PHOTO_AREAS.length} recommended
          photo areas labeled. Files stay in this browser only — nothing is
          uploaded to storage yet.
        </p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {RECOMMENDED_PHOTO_AREAS.map((area) => {
            const present = providedSet.has(area.type);
            return (
              <li
                key={area.type}
                className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <span>{area.label}</span>
                {present ? (
                  <span className="font-medium text-accent">Provided</span>
                ) : (
                  <span className="font-medium text-amber-700">Missing</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <label
          htmlFor={inputId}
          className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-center transition hover:bg-muted"
        >
          <span className="text-sm font-semibold text-foreground">
            Add listing photos
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            JPEG or PNG. Large touch target for phone uploads.
          </span>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      {photos.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.fileName}
                className="h-44 w-full object-cover"
              />
              <div className="space-y-2 p-3">
                <p className="truncate font-mono text-[0.7rem] text-muted-foreground">
                  {photo.fileName}
                </p>
                <label className="block text-xs font-medium text-foreground">
                  Photo type
                  <select
                    value={photo.claimedType}
                    onChange={(event) =>
                      updateType(
                        photo.id,
                        event.target.value as ClaimedPhotoType | "",
                      )
                    }
                    className={cn(
                      "mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm",
                    )}
                  >
                    <option value="">Unlabeled</option>
                    {CLAIMED_PHOTO_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {PHOTO_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
