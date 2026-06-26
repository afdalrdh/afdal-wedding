import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { resolveAdminMessage } from "@/lib/admin-display";
import { pickSearchParam } from "@/lib/wedding-validation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Wedding",
  description: "Admin reservasi dan invitation.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin/invitations");
  }

  const params = await searchParams;
  const error = resolveAdminMessage(pickSearchParam(params.error));

  return <AdminLogin configured={isAdminConfigured()} error={error} />;
}
