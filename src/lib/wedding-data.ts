import { randomBytes } from "crypto";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { DEFAULT_WHATSAPP_MESSAGE } from "./invitation-message";
import type {
  InvitationPageFilters,
  InvitationRecord,
  InvitationStats,
  PaginatedInvitations,
  PaginatedReservations,
  ReservationRecord,
  ReservationPageFilters,
  ReservationStats,
} from "./wedding-types";
import type { InvitationInput, ReservationInput } from "./wedding-validation";
import { normalizeSlug } from "./wedding-validation";

type SqlClient = NeonQueryFunction<false, false>;
type Row = Record<string, unknown>;
type QueryValue = string | number | boolean | null;

const DEFAULT_WHATSAPP_MESSAGE_KEY = "default_whatsapp_message";

let sqlClient: SqlClient | null = null;
let schemaReady: Promise<void> | null = null;

export class MissingDatabaseUrlError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "MissingDatabaseUrlError";
  }
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function getSqlClient() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return null;

  if (!sqlClient) {
    sqlClient = neon<false, false>(databaseUrl);
  }

  return sqlClient;
}

async function ensureSchema(sql: SqlClient) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS invitations (
          id BIGSERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          guest_name TEXT NOT NULL,
          group_label TEXT,
          phone TEXT,
          notes TEXT,
          custom_message TEXT,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        ALTER TABLE invitations
        ADD COLUMN IF NOT EXISTS custom_message TEXT
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS reservations (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          attendance TEXT NOT NULL CHECK (attendance IN ('Hadir', 'Tidak Hadir')),
          location TEXT,
          message TEXT NOT NULL,
          invitation_slug TEXT,
          invitation_name TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS app_config (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS reservations_created_at_idx
        ON reservations (created_at DESC)
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS reservations_invitation_slug_idx
        ON reservations (invitation_slug)
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS invitations_active_idx
        ON invitations (is_active)
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }

  await schemaReady;
}

async function requireSqlClient() {
  const sql = getSqlClient();
  if (!sql) {
    throw new MissingDatabaseUrlError();
  }
  await ensureSchema(sql);
  return sql;
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return 0;
}

function toIsoString(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return new Date().toISOString();
}

function toNullableString(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

function mapReservation(row: Row): ReservationRecord {
  return {
    id: toNumber(row.id),
    name: String(row.name ?? ""),
    attendance: row.attendance === "Tidak Hadir" ? "Tidak Hadir" : "Hadir",
    location: toNullableString(row.location),
    message: String(row.message ?? ""),
    invitationSlug: toNullableString(row.invitation_slug),
    invitationName: toNullableString(row.invitation_name),
    createdAt: toIsoString(row.created_at),
  };
}

function mapInvitation(row: Row): InvitationRecord {
  return {
    id: toNumber(row.id),
    slug: String(row.slug ?? ""),
    guestName: String(row.guest_name ?? ""),
    customMessage: toNullableString(row.custom_message),
    isActive: Boolean(row.is_active),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

function getPaginationMeta(total: number, page: number, pageSize: number) {
  return {
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

function getCount(row: Row | undefined) {
  return toNumber(row?.total);
}

export async function getPublicReservations(limit = 100) {
  if (!isDatabaseConfigured()) return [];

  const sql = await requireSqlClient();
  const rows = await sql`
    SELECT id, name, attendance, location, message, invitation_slug, invitation_name, created_at
    FROM reservations
    ORDER BY created_at DESC
    LIMIT ${Math.max(1, Math.min(limit, 1000))}
  `;

  return rows.map(mapReservation);
}

export async function getAdminReservations(limit = 100) {
  if (!isDatabaseConfigured()) return [];

  const sql = await requireSqlClient();
  const rows = await sql`
    SELECT id, name, attendance, location, message, invitation_slug, invitation_name, created_at
    FROM reservations
    ORDER BY created_at DESC
    LIMIT ${Math.max(1, Math.min(limit, 500))}
  `;

  return rows.map(mapReservation);
}

export async function getAdminReservationsPage({
  page,
  pageSize,
}: ReservationPageFilters): Promise<PaginatedReservations> {
  if (!isDatabaseConfigured()) {
    return {
      data: [],
      meta: getPaginationMeta(0, page, pageSize),
    };
  }

  const sql = await requireSqlClient();
  const limit = Math.max(1, Math.min(pageSize, 100));
  const offset = Math.max(0, (page - 1) * limit);

  const [rows, countRows] = await Promise.all([
    sql.query(
      `
        SELECT id, name, attendance, location, message, invitation_slug, invitation_name, created_at
        FROM reservations
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    ),
    sql.query(`SELECT COUNT(*)::int AS total FROM reservations`),
  ]);

  const total = getCount(countRows[0] as Row | undefined);

  return {
    data: rows.map(mapReservation),
    meta: getPaginationMeta(total, page, limit),
  };
}

export async function getReservationStats(): Promise<ReservationStats> {
  if (!isDatabaseConfigured()) {
    return { total: 0, present: 0, absent: 0 };
  }

  const sql = await requireSqlClient();
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE attendance = 'Hadir')::int AS present,
      COUNT(*) FILTER (WHERE attendance = 'Tidak Hadir')::int AS absent
    FROM reservations
  `;

  const row = rows[0] as Row | undefined;
  return {
    total: toNumber(row?.total),
    present: toNumber(row?.present),
    absent: toNumber(row?.absent),
  };
}

export async function createReservation(input: ReservationInput) {
  const sql = await requireSqlClient();
  const rows = await sql`
    INSERT INTO reservations (
      name,
      attendance,
      location,
      message,
      invitation_slug,
      invitation_name
    )
    VALUES (
      ${input.name},
      ${input.attendance},
      ${input.location},
      ${input.message},
      ${input.invitationSlug},
      ${input.invitationName}
    )
    RETURNING id, name, attendance, location, message, invitation_slug, invitation_name, created_at
  `;

  return mapReservation(rows[0] as Row);
}

export async function getActiveInvitationBySlug(slug: string | null | undefined) {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug || !isDatabaseConfigured()) return null;

  const sql = await requireSqlClient();
  const rows = await sql`
    SELECT id, slug, guest_name, custom_message, is_active, created_at, updated_at
    FROM invitations
    WHERE slug = ${normalizedSlug} AND is_active = TRUE
    LIMIT 1
  `;

  if (!rows[0]) return null;
  return mapInvitation(rows[0] as Row);
}

export async function getInvitations(limit = 100) {
  if (!isDatabaseConfigured()) return [];

  const sql = await requireSqlClient();
  const rows = await sql`
    SELECT id, slug, guest_name, custom_message, is_active, created_at, updated_at
    FROM invitations
    ORDER BY created_at DESC
    LIMIT ${Math.max(1, Math.min(limit, 500))}
  `;

  return rows.map(mapInvitation);
}

export async function getDefaultWhatsappMessage() {
  if (!isDatabaseConfigured()) return DEFAULT_WHATSAPP_MESSAGE;

  const sql = await requireSqlClient();
  const rows = await sql`
    SELECT value
    FROM app_config
    WHERE key = ${DEFAULT_WHATSAPP_MESSAGE_KEY}
    LIMIT 1
  `;

  const value = toNullableString((rows[0] as Row | undefined)?.value);
  return value || DEFAULT_WHATSAPP_MESSAGE;
}

export async function updateDefaultWhatsappMessage(message: string) {
  const sql = await requireSqlClient();

  await sql`
    INSERT INTO app_config (key, value, updated_at)
    VALUES (${DEFAULT_WHATSAPP_MESSAGE_KEY}, ${message}, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = NOW()
  `;
}

function buildInvitationFilter(filters: InvitationPageFilters) {
  const where: string[] = [];
  const values: QueryValue[] = [];

  if (filters.search) {
    values.push(`%${filters.search}%`);
    where.push(
      `(guest_name ILIKE $${values.length} OR slug ILIKE $${values.length} OR COALESCE(custom_message, '') ILIKE $${values.length})`,
    );
  }

  if (filters.status === "active") {
    where.push("is_active = TRUE");
  }

  if (filters.status === "inactive") {
    where.push("is_active = FALSE");
  }

  return {
    clause: where.length ? `WHERE ${where.join(" AND ")}` : "",
    values,
  };
}

export async function getInvitationsPage(
  filters: InvitationPageFilters,
): Promise<PaginatedInvitations> {
  if (!isDatabaseConfigured()) {
    return {
      data: [],
      meta: getPaginationMeta(0, filters.page, filters.pageSize),
    };
  }

  const sql = await requireSqlClient();
  const limit = Math.max(5, Math.min(filters.pageSize, 100));
  const offset = Math.max(0, (filters.page - 1) * limit);
  const where = buildInvitationFilter(filters);
  const limitIndex = where.values.length + 1;
  const offsetIndex = where.values.length + 2;

  const [rows, countRows] = await Promise.all([
    sql.query(
      `
        SELECT id, slug, guest_name, custom_message, is_active, created_at, updated_at
        FROM invitations
        ${where.clause}
        ORDER BY created_at DESC
        LIMIT $${limitIndex} OFFSET $${offsetIndex}
      `,
      [...where.values, limit, offset],
    ),
    sql.query(
      `
        SELECT COUNT(*)::int AS total
        FROM invitations
        ${where.clause}
      `,
      where.values,
    ),
  ]);

  const total = getCount(countRows[0] as Row | undefined);

  return {
    data: rows.map(mapInvitation),
    meta: getPaginationMeta(total, filters.page, limit),
  };
}

export async function getInvitationStats(): Promise<InvitationStats> {
  if (!isDatabaseConfigured()) {
    return { total: 0, active: 0, inactive: 0 };
  }

  const sql = await requireSqlClient();
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active,
      COUNT(*) FILTER (WHERE is_active = FALSE)::int AS inactive
    FROM invitations
  `;

  const row = rows[0] as Row | undefined;

  return {
    total: toNumber(row?.total),
    active: toNumber(row?.active),
    inactive: toNumber(row?.inactive),
  };
}

async function createUniqueSlug(sql: SqlClient) {
  for (let index = 0; index < 80; index += 1) {
    const candidate = `inv-${randomBytes(5).toString("hex")}`;
    const rows = await sql`
      SELECT id
      FROM invitations
      WHERE slug = ${candidate}
      LIMIT 1
    `;

    if (!rows[0]) return candidate;
  }

  return `inv-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`;
}

export async function createInvitation(input: InvitationInput) {
  const sql = await requireSqlClient();
  const slug = await createUniqueSlug(sql);

  const rows = await sql`
    INSERT INTO invitations (
      slug,
      guest_name,
      custom_message
    )
    VALUES (
      ${slug},
      ${input.guestName},
      ${input.customMessage}
    )
    RETURNING id, slug, guest_name, custom_message, is_active, created_at, updated_at
  `;

  return mapInvitation(rows[0] as Row);
}

export async function createInvitationsBulk(inputs: InvitationInput[]) {
  const created: InvitationRecord[] = [];

  for (const input of inputs) {
    created.push(await createInvitation(input));
  }

  return created;
}

export async function setInvitationActive(id: number, isActive: boolean) {
  const sql = await requireSqlClient();
  const rows = await sql`
    UPDATE invitations
    SET is_active = ${isActive}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, slug, guest_name, custom_message, is_active, created_at, updated_at
  `;

  if (!rows[0]) return null;
  return mapInvitation(rows[0] as Row);
}

export async function deleteInvitation(id: number) {
  const sql = await requireSqlClient();
  await sql`
    DELETE FROM invitations
    WHERE id = ${id}
  `;
}

export async function deleteReservation(id: number) {
  const sql = await requireSqlClient();
  await sql`
    DELETE FROM reservations
    WHERE id = ${id}
  `;
}
