"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import {
  createInvitation,
  createInvitationsBulk,
  deleteInvitation,
  deleteReservation,
  setInvitationActive,
  updateDefaultWhatsappMessage,
} from "@/lib/wedding-data";
import { parseInvitationWorkbook } from "@/lib/invitation-excel";
import {
  normalizeMultilineText,
  validateInvitationForm,
} from "@/lib/wedding-validation";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=auth");
  }
}

function parseId(formData: FormData) {
  const id = Number(formData.get("id"));
  return Number.isFinite(id) && id > 0 ? id : null;
}

function redirectWithError(message: string, path = "/admin/invitations"): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(message: string, path = "/admin/invitations"): never {
  redirect(`${path}?success=${encodeURIComponent(message)}`);
}

export async function loginAdmin(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  if (!verifyAdminCredentials(username, password)) {
    redirect("/admin?error=invalid");
  }

  await createAdminSession();
  redirect("/admin/invitations");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}

export async function createInvitationAction(formData: FormData) {
  await requireAdmin();

  const validation = validateInvitationForm(formData);
  if (!validation.ok) {
    redirectWithError(validation.error);
  }

  try {
    await createInvitation(validation.data);
  } catch {
    redirectWithError("Invitation belum bisa disimpan.");
  }

  revalidatePath("/admin/invitations");
  redirectWithSuccess("Invitation berhasil dibuat.");
}

export async function uploadInvitationsAction(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirectWithError("File Excel wajib dipilih.");
  }

  if (file.size > 2_000_000) {
    redirectWithError("Ukuran file maksimal 2MB.");
  }

  let parsed: Awaited<ReturnType<typeof parseInvitationWorkbook>>;
  try {
    parsed = await parseInvitationWorkbook(file);
  } catch {
    redirectWithError("File Excel belum bisa diproses.");
  }

  if (parsed.errors.length) {
    redirectWithError(parsed.errors.slice(0, 3).join(" "));
  }

  if (!parsed.rows.length) {
    redirectWithError("Tidak ada data invitation yang valid di file.");
  }

  try {
    await createInvitationsBulk(parsed.rows);
  } catch {
    redirectWithError("Data invitation dari file belum bisa disimpan.");
  }

  revalidatePath("/admin/invitations");
  redirectWithSuccess(`${parsed.rows.length} invitation berhasil diimport.`);
}

export async function setInvitationStatusAction(formData: FormData) {
  await requireAdmin();

  const id = parseId(formData);
  if (!id) {
    redirectWithError("ID invitation tidak valid.");
  }

  const nextActive = formData.get("nextActive") === "true";

  try {
    await setInvitationActive(id, nextActive);
  } catch {
    redirectWithError("Status invitation belum bisa diubah.");
  }

  revalidatePath("/admin/invitations");
  redirectWithSuccess("Status invitation berhasil diubah.");
}

export async function deleteInvitationAction(formData: FormData) {
  await requireAdmin();

  const id = parseId(formData);
  if (!id) {
    redirectWithError("ID invitation tidak valid.");
  }

  try {
    await deleteInvitation(id);
  } catch {
    redirectWithError("Invitation belum bisa dihapus.");
  }

  revalidatePath("/admin/invitations");
  redirectWithSuccess("Invitation berhasil dihapus.");
}

export async function deleteReservationAction(formData: FormData) {
  await requireAdmin();

  const id = parseId(formData);
  if (!id) {
    redirectWithError("ID reservasi tidak valid.", "/admin/reservations");
  }

  try {
    await deleteReservation(id);
  } catch {
    redirectWithError("Reservasi belum bisa dihapus.", "/admin/reservations");
  }

  revalidatePath("/admin/reservations");
  redirectWithSuccess("Reservasi berhasil dihapus.", "/admin/reservations");
}

export async function updateDefaultWhatsappMessageAction(formData: FormData) {
  await requireAdmin();

  const message = normalizeMultilineText(formData.get("defaultMessage"), 3000);

  if (!message) {
    redirectWithError("Default WhatsApp message wajib diisi.", "/admin/config");
  }

  try {
    await updateDefaultWhatsappMessage(message);
  } catch {
    redirectWithError(
      "Default WhatsApp message belum bisa disimpan.",
      "/admin/config",
    );
  }

  revalidatePath("/admin/config");
  revalidatePath("/admin/invitations");
  redirectWithSuccess("Default WhatsApp message berhasil disimpan.", "/admin/config");
}
