import { ATTENDANCE_OPTIONS, type Attendance } from "./wedding-types";

export interface ReservationInput {
  name: string;
  attendance: Attendance;
  location: string | null;
  message: string;
  invitationSlug: string | null;
  invitationName: string | null;
}

export interface InvitationInput {
  guestName: string;
  slug: string | null;
  customMessage: string | null;
}

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function normalizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function normalizeMultilineText(
  value: unknown,
  maxLength: number,
): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .replace(/[ \t]+/g, " ")
    .slice(0, maxLength);
}

export function normalizeAttendance(value: unknown): Attendance | null {
  if (ATTENDANCE_OPTIONS.includes(value as Attendance)) {
    return value as Attendance;
  }
  return null;
}

export function slugifyGuestName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function normalizeSlug(value: unknown): string | null {
  const text = normalizeText(value, 100);
  if (!text) return null;
  const slug = slugifyGuestName(text);
  return slug || null;
}

export function pickSearchParam(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export function pickPositiveInteger(
  value: string | string[] | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  const parsed = Number(pickSearchParam(value));
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(Math.trunc(parsed), max));
}

export function validateReservationPayload(
  payload: unknown,
): ValidationResult<ReservationInput> {
  const record = payload as Record<string, unknown>;
  const name = normalizeText(record?.name, 100);
  const attendance = normalizeAttendance(record?.attendance);
  const location = normalizeText(record?.location, 100) || null;
  const message = normalizeMultilineText(record?.message, 700);
  const invitationSlug = normalizeSlug(record?.invitationSlug);
  const invitationName = normalizeText(record?.invitationName, 140) || null;

  if (!name) {
    return { ok: false, error: "Nama wajib diisi." };
  }

  if (!attendance) {
    return { ok: false, error: "Pilihan kehadiran tidak valid." };
  }

  if (!message) {
    return { ok: false, error: "Ucapan wajib diisi." };
  }

  return {
    ok: true,
    data: {
      name,
      attendance,
      location,
      message,
      invitationSlug,
      invitationName,
    },
  };
}

export function validateInvitationForm(
  formData: FormData,
): ValidationResult<InvitationInput> {
  return validateInvitationInput({
    guestName: formData.get("guestName"),
    slug: null,
    customMessage: formData.get("customMessage"),
  });
}

export function validateInvitationInput(
  input: Record<string, unknown>,
): ValidationResult<InvitationInput> {
  const guestName = normalizeText(input.guestName, 140);
  const slug = normalizeSlug(input.slug);
  const customMessage =
    normalizeMultilineText(input.customMessage, 1600) || null;

  if (!guestName) {
    return { ok: false, error: "Nama undangan wajib diisi." };
  }

  return {
    ok: true,
    data: {
      guestName,
      slug,
      customMessage,
    },
  };
}
