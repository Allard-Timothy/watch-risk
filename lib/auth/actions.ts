"use server";

import { redirect } from "next/navigation";

import { auth, signIn } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    redirect("/login?error=missing_email");
  }
  await signIn("email", { email, redirectTo: "/login/verify" });
}

export async function logoutAction() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/" });
}

export async function getSessionUserId(): Promise<string | undefined> {
  const session = await auth();
  return session?.user?.id;
}
