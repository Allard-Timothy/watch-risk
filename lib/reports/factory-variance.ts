import { normalizeReference } from "@/lib/knowledge/match-reference";
import type {
  DefectSeed,
  FactorySeed,
  ModelDossierSeed,
} from "@/lib/knowledge/schemas";
import { PHOTO_TYPE_LABELS, isDetectedPhotoType } from "@/lib/photos";
import type { ClaimedPhotoType } from "@/lib/photos";
import type { DetectedPhotoType, ImageFinding } from "@/lib/validation";

export const CANNOT_ASSESS_FROM_IMAGES =
  "Cannot assess from submitted images.";

export const FACTORY_VARIANCE_DISCLAIMER =
  "Known factory variance is a curated checklist of what buyers should look for. It is not proof that a submitted photo shows a defect, and it is not a pixel analysis.";

export const FACTORY_VARIANCE_ASSESSMENT_COPY = {
  photo_present: "Photo present",
  cannot_assess: "cannot assess from submitted images",
  not_tied_to_photo: "Not tied to a submitted photo type",
} as const;

export type FactoryVarianceAssessment =
  keyof typeof FACTORY_VARIANCE_ASSESSMENT_COPY;

export type FactoryVarianceItem = Readonly<{
  id: string;
  area: string;
  photoType?: DetectedPhotoType;
  lookFor: string;
  photosCannotShow?: string;
  assessment: FactoryVarianceAssessment;
}>;

export type FactoryVariance = Readonly<{
  factoryId: string;
  factoryName: string;
  notes?: string;
  disclaimer: string;
  items: readonly FactoryVarianceItem[];
}>;

function areaLabel(type: DetectedPhotoType): string {
  if (type in PHOTO_TYPE_LABELS) {
    return PHOTO_TYPE_LABELS[type as ClaimedPhotoType];
  }
  return type;
}

function namedFactoryLabel(
  factory?: FactorySeed,
  dossier?: ModelDossierSeed,
): { factoryId: string; factoryName: string } | undefined {
  if (factory && factory.factoryId !== "unknown") {
    return {
      factoryId: factory.factoryId,
      factoryName: factory.canonicalName,
    };
  }
  if (dossier?.factory && dossier.factory !== "unknown") {
    return {
      factoryId: dossier.factory,
      factoryName: dossier.factory,
    };
  }
  return undefined;
}

export function defectsForReference(
  factory: FactorySeed,
  reference?: string,
): DefectSeed[] {
  if (!reference?.trim()) {
    return [...factory.defects];
  }
  const needle = normalizeReference(reference);
  return factory.defects.filter((defect) =>
    defect.references.some((ref) => normalizeReference(ref) === needle),
  );
}

function assessmentFor(
  photoType: DetectedPhotoType | undefined,
  provided: ReadonlySet<DetectedPhotoType>,
): FactoryVarianceAssessment {
  if (!photoType) {
    return "not_tied_to_photo";
  }
  return provided.has(photoType) ? "photo_present" : "cannot_assess";
}

function itemFromDefect(
  defect: DefectSeed,
  provided: ReadonlySet<DetectedPhotoType>,
): FactoryVarianceItem {
  const photoType =
    defect.photoType && isDetectedPhotoType(defect.photoType)
      ? defect.photoType
      : undefined;
  return {
    id: defect.id,
    area: defect.area,
    photoType,
    lookFor: defect.whatBuyersShouldLookFor,
    photosCannotShow: defect.whatPhotosCannotShow,
    assessment: assessmentFor(photoType, provided),
  };
}

function itemsFromCheckpoints(
  dossier: ModelDossierSeed,
  provided: ReadonlySet<DetectedPhotoType>,
): FactoryVarianceItem[] {
  const items: FactoryVarianceItem[] = [];
  for (const [area, checkpoints] of Object.entries(dossier.riskCheckpoints)) {
    const photoType = isDetectedPhotoType(area) ? area : undefined;
    checkpoints.forEach((checkpoint, index) => {
      items.push({
        id: `${dossier.id}-${area}-${index}`,
        area: photoType ? areaLabel(photoType) : area,
        photoType,
        lookFor: checkpoint,
        assessment: assessmentFor(photoType, provided),
      });
    });
  }
  return items;
}

/**
 * Build the Known factory variance section when a matched dossier names a
 * factory other than "unknown". Prefers curated factory defects for this
 * reference; falls back to dossier checkpoints if the factory seed has none.
 */
export function buildFactoryVariance(
  providedPhotoTypes: readonly DetectedPhotoType[],
  dossier?: ModelDossierSeed,
  factory?: FactorySeed,
  reference?: string,
): FactoryVariance | undefined {
  const named = namedFactoryLabel(factory, dossier);
  if (!named) {
    return undefined;
  }

  const provided = new Set(providedPhotoTypes);
  const listingReference = reference ?? dossier?.reference;
  const defects = factory
    ? defectsForReference(factory, listingReference)
    : [];
  const items =
    defects.length > 0
      ? defects.map((defect) => itemFromDefect(defect, provided))
      : dossier
        ? itemsFromCheckpoints(dossier, provided)
        : [];

  if (items.length === 0) {
    return undefined;
  }

  return {
    factoryId: named.factoryId,
    factoryName: named.factoryName,
    notes: factory?.notes ?? dossier?.notes,
    disclaimer: FACTORY_VARIANCE_DISCLAIMER,
    items,
  };
}

export function concernsFromFactoryVariance(
  variance: FactoryVariance | undefined,
): ImageFinding[] {
  if (!variance) {
    return [];
  }
  return variance.items
    .filter((item) => item.assessment === "cannot_assess")
    .map((item) => ({
      area: item.area,
      severity: "medium" as const,
      finding: CANNOT_ASSESS_FROM_IMAGES,
      visibleEvidence: `No ${item.area.toLowerCase()} photo was submitted. ${FACTORY_VARIANCE_DISCLAIMER}`,
    }));
}
