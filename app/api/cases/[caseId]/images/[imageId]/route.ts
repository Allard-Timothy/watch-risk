import { NextResponse } from "next/server";

import { canAccessCasePhotos } from "@/lib/cases/access";
import { getCaseImage } from "@/lib/cases/repository";
import { mimeForStoragePath, readCasePhotoFile } from "@/lib/storage/local";

type RouteContext = Readonly<{
  params: Promise<{ caseId: string; imageId: string }>;
}>;

export async function GET(_request: Request, context: RouteContext) {
  const { caseId, imageId } = await context.params;
  const allowed = await canAccessCasePhotos(caseId);
  if (!allowed) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const photo = await getCaseImage(caseId, imageId);
  if (!photo) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const bytes = await readCasePhotoFile(photo.storagePath);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": mimeForStoragePath(photo.storagePath),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
