import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "solid_wedding_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    ""
  );
}

function safeEqual(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function buildSessionToken() {
  const secret = getSessionSecret();
  if (!secret) return "";
  return createHmac("sha256", secret)
    .update("solid-wedding-admin-session")
    .digest("hex");
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME?.trim() || "admin";
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!expectedPassword) return false;

  return (
    username.trim() === getAdminUsername() &&
    safeEqual(password, expectedPassword)
  );
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const expectedToken = buildSessionToken();

  if (!token || !expectedToken) return false;
  return safeEqual(token, expectedToken);
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const token = buildSessionToken();

  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
