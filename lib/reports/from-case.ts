import type { PersistedWatchCase } from "@/lib/cases/repository";
import type { ReportInput } from "@/lib/reports/generate-report";
import { providedDetectedTypes } from "@/lib/photos";
import type { ClaimedPhotoType } from "@/lib/photos";

export function reportInputFromCase(
  listing: PersistedWatchCase,
  claimedTypes?: readonly (ClaimedPhotoType | "")[],
): ReportInput {
  const types =
    claimedTypes ?? listing.photos.map((photo) => photo.claimedType);
  return {
    brand: listing.brand,
    model: listing.model,
    reference: listing.reference,
    claimedYear: listing.claimedYear,
    askingPrice: listing.askingPrice,
    sellerPlatform: listing.sellerPlatform,
    providedPhotoTypes: providedDetectedTypes(types),
  };
}
