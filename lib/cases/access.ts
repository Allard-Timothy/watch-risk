import { auth } from "@/lib/auth";
import { getWatchCaseWithOwner } from "@/lib/cases/repository";

export async function canAccessCasePhotos(caseId: string): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;
  const watchCase = await getWatchCaseWithOwner(caseId);
  if (!watchCase) {
    return false;
  }
  if (!watchCase.userId) {
    return true;
  }
  if (!userId) {
    return false;
  }
  return watchCase.userId === userId;
}
