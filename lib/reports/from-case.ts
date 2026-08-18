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
    listingUrl: listing.listingUrl,
    listingText: listing.listingText,
    sellerClaims: listing.sellerClaims,
    claimsFullSet: claimsFullSetFromText(
      listing.listingText,
      listing.sellerClaims,
    ),
    stockPhotosOnly: stockPhotosFromText(
      listing.listingText,
      listing.sellerClaims,
    ),
    providedPhotoTypes: providedDetectedTypes(types),
  };
}

export function claimsFullSetFromText(
  listingText?: string,
  sellerClaims?: string,
): boolean {
  const blob = `${listingText ?? ""} ${sellerClaims ?? ""}`.toLowerCase();
  return /full set|box and papers|with papers/.test(blob);
}

function stockPhotosFromText(
  listingText?: string,
  sellerClaims?: string,
): boolean {
  const blob = `${listingText ?? ""} ${sellerClaims ?? ""}`.toLowerCase();
  return /stock photos? only|catalogue photos? only|catalog photos? only/.test(
    blob,
  );
}
