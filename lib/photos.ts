import type { PhotoType } from "@prisma/client";
import {
  DETECTED_PHOTO_TYPES,
  type DetectedPhotoType,
} from "@/lib/validation";

/**
 * Claimed photo types for intake. Mirrors the Prisma `PhotoType` enum as
 * lowercase on-the-wire values. The generator's recommended completeness set is
 * a subset of these (see RECOMMENDED_PHOTO_AREAS).
 */

export const CLAIMED_PHOTO_TYPES = [
  "dial",
  "rehaut",
  "date_cyclops",
  "bezel",
  "crown_guards",
  "caseback",
  "bracelet",
  "clasp",
  "end_links",
  "movement",
  "papers",
  "other",
] as const;

export type ClaimedPhotoType = (typeof CLAIMED_PHOTO_TYPES)[number];

export const PHOTO_TYPE_LABELS: Record<ClaimedPhotoType, string> = {
  dial: "Dial",
  rehaut: "Rehaut",
  date_cyclops: "Date / cyclops",
  bezel: "Bezel",
  crown_guards: "Crown guards",
  caseback: "Caseback",
  bracelet: "Bracelet / strap",
  clasp: "Clasp",
  end_links: "End links",
  movement: "Movement",
  papers: "Papers",
  other: "Other",
};

/** Recommended areas for a useful photo-based buyer-risk review. */
export const RECOMMENDED_PHOTO_AREAS: readonly {
  type: DetectedPhotoType;
  label: string;
}[] = [
  { type: "dial", label: "Dial" },
  { type: "caseback", label: "Caseback" },
  { type: "rehaut", label: "Rehaut" },
  { type: "clasp", label: "Clasp" },
  { type: "bracelet", label: "Bracelet / strap" },
  { type: "movement", label: "Movement" },
];

export function isDetectedPhotoType(
  value: string,
): value is DetectedPhotoType {
  return (DETECTED_PHOTO_TYPES as readonly string[]).includes(value);
}

export function recommendedPhotoAreasFor(
  requiredTypes?: readonly string[],
): { type: DetectedPhotoType; label: string }[] {
  if (!requiredTypes || requiredTypes.length === 0) {
    return [...RECOMMENDED_PHOTO_AREAS];
  }
  const areas = requiredTypes.flatMap((type) => {
    if (!isDetectedPhotoType(type) || type === "other") {
      return [];
    }
    const label =
      type in PHOTO_TYPE_LABELS
        ? PHOTO_TYPE_LABELS[type as ClaimedPhotoType]
        : type;
    return [{ type, label }];
  });
  return areas.length > 0 ? areas : [...RECOMMENDED_PHOTO_AREAS];
}

export function providedDetectedTypes(
  claimed: readonly (ClaimedPhotoType | "")[],
): DetectedPhotoType[] {
  const found = new Set<DetectedPhotoType>();
  for (const type of claimed) {
    if (type && isDetectedPhotoType(type)) {
      found.add(type);
    }
  }
  return [...found];
}

export function claimedTypeToPrisma(type: ClaimedPhotoType): PhotoType {
  return type.toUpperCase() as PhotoType;
}

export function prismaToClaimedType(
  type: PhotoType | null,
): ClaimedPhotoType | "" {
  if (!type) {
    return "";
  }
  return type.toLowerCase() as ClaimedPhotoType;
}
