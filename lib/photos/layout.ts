import type { ClaimedPhotoType } from "@/lib/photos";
import type { DetectedPhotoType } from "@/lib/validation";

export type ReportPhoto = Readonly<{
  id: string;
  claimedType: ClaimedPhotoType | "";
  url: string;
}>;

export function firstPhotoOfType(
  photos: readonly ReportPhoto[],
  type: DetectedPhotoType | ClaimedPhotoType,
): ReportPhoto | undefined {
  return photos.find((photo) => photo.claimedType === type);
}

export function unusedPhoto(
  photos: readonly ReportPhoto[],
  usedIds: Set<string>,
): ReportPhoto | undefined {
  return photos.find((photo) => !usedIds.has(photo.id));
}

export function heroPhotoLayout(photos: readonly ReportPhoto[]): {
  primary: ReportPhoto | undefined;
  secondary: ReportPhoto | undefined;
  tertiary: ReportPhoto | undefined;
} {
  const used = new Set<string>();
  const pick = (type: DetectedPhotoType) => {
    const photo = firstPhotoOfType(photos, type);
    if (!photo || used.has(photo.id)) {
      return undefined;
    }
    used.add(photo.id);
    return photo;
  };

  const primary = pick("dial") ?? unusedPhoto(photos, used);
  if (primary) used.add(primary.id);

  const secondary = pick("bracelet") ?? unusedPhoto(photos, used);
  if (secondary) used.add(secondary.id);

  const tertiary = pick("caseback") ?? unusedPhoto(photos, used);

  return { primary, secondary, tertiary };
}
