import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Download,
  Mail,
  PauseCircle,
  PlayCircle,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import {
  createInvitationAction,
  deleteInvitationAction,
  setInvitationStatusAction,
  uploadInvitationsAction,
} from "../actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { CopyTextButton } from "@/components/admin/CopyTextButton";
import { InvitationTableControls } from "@/components/admin/InvitationTableControls";
import { Pagination } from "@/components/admin/Pagination";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  formatAdminDate,
  getSiteUrl,
  resolveAdminMessage,
} from "@/lib/admin-display";
import { buildInvitationShareText } from "@/lib/invitation-message";
import {
  getDefaultWhatsappMessage,
  getInvitationStats,
  getInvitationsPage,
  isDatabaseConfigured,
} from "@/lib/wedding-data";
import type {
  InvitationRecord,
  InvitationStatusFilter,
} from "@/lib/wedding-types";
import {
  normalizeText,
  pickPositiveInteger,
  pickSearchParam,
} from "@/lib/wedding-validation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Invitation",
  description: "Kelola data invitation.",
};

function parseStatus(value: string | null): InvitationStatusFilter {
  if (value === "active" || value === "inactive") return value;
  return "all";
}

function queryParams({
  search,
  status,
  pageSize,
}: {
  search: string;
  status: InvitationStatusFilter;
  pageSize: number;
}) {
  const params: Record<string, string> = {
    pageSize: String(pageSize),
  };

  if (search) params.q = search;
  if (status !== "all") params.status = status;

  return params;
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "dark" | "green" | "muted";
}) {
  const toneClass =
    tone === "green"
      ? "bg-[#E8F7EE] text-[#2E7B57]"
      : tone === "muted"
        ? "bg-[#ECE8E2] text-[#706A64]"
        : "bg-[#F4EDE9] text-[#8D4327]";

  return (
    <div className="rounded-[8px] border border-[#DED8CF] bg-white p-4">
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${toneClass}`}
      >
        {label}
      </span>
      <p className="mt-3 text-[30px] font-bold leading-none text-[#2E2A27]">
        {value}
      </p>
    </div>
  );
}

function FieldMeta({ type }: { type: "required" | "optional" }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.6px] ${
        type === "required"
          ? "bg-[#FFF1F1] text-[#9B3535]"
          : "bg-[#ECE8E2] text-[#706A64]"
      }`}
    >
      {type === "required" ? "Required" : "Optional"}
    </span>
  );
}

function InvitationForm({ disabled }: { disabled: boolean }) {
  return (
    <section className="rounded-[8px] border border-[#DED8CF] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#F4EDE9] text-[#8D4327]">
          <Mail className="h-4 w-4" aria-hidden />
        </div>
        <h2 className="text-[17px] font-bold text-[#2E2A27]">Invitation Baru</h2>
      </div>

      <form action={createInvitationAction} className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[1px] text-[#6F625A]">
            Nama Undangan
            <FieldMeta type="required" />
          </span>
          <input
            name="guestName"
            required
            placeholder="Bapak/Ibu/Saudara/i"
            disabled={disabled}
            className="h-11 rounded-[8px] border border-[#D9D4CD] bg-[#FBFAF8] px-3 text-[14px] font-semibold outline-none transition placeholder:text-[#B8B1AB] focus:border-[#8D4327] focus:ring-2 focus:ring-[#E8C8C7] disabled:cursor-not-allowed disabled:bg-[#F0EEEA]"
          />
        </label>

        <label className="grid gap-2">
          <span className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[1px] text-[#6F625A]">
            Custom Message
            <FieldMeta type="optional" />
          </span>
          <textarea
            name="customMessage"
            rows={6}
            placeholder="Pesan panjang untuk dibagikan via WhatsApp. Link undangan akan otomatis ditambahkan saat copy teks WA."
            disabled={disabled}
            className="resize-none rounded-[8px] border border-[#D9D4CD] bg-[#FBFAF8] px-3 py-2 text-[14px] font-semibold leading-[22px] outline-none transition focus:border-[#8D4327] focus:ring-2 focus:ring-[#E8C8C7] disabled:cursor-not-allowed disabled:bg-[#F0EEEA]"
          />
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#4A0E0E] px-4 text-[14px] font-bold text-white transition hover:bg-[#3C0B0B] disabled:cursor-not-allowed disabled:bg-[#A79D95]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Buat Invitation
        </button>
      </form>
    </section>
  );
}

function UploadPanel({ disabled }: { disabled: boolean }) {
  return (
    <section className="rounded-[8px] border border-[#DED8CF] bg-white p-5">
      <h2 className="text-[17px] font-bold text-[#2E2A27]">Import Excel</h2>

      <form
        action={uploadInvitationsAction}
        className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]"
      >
        <input
          name="file"
          type="file"
          accept=".xlsx,.xls"
          disabled={disabled}
          required
          className="h-10 rounded-[8px] border border-[#D9D4CD] bg-[#FBFAF8] px-3 py-2 text-[13px] font-semibold text-[#5F5750] file:mr-3 file:rounded-[6px] file:border-0 file:bg-[#EEE8E0] file:px-3 file:py-1 file:text-[12px] file:font-bold file:text-[#4A0E0E] disabled:cursor-not-allowed disabled:bg-[#F0EEEA]"
        />

        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#4A0E0E] px-4 text-[13px] font-bold text-white transition hover:bg-[#3C0B0B] disabled:cursor-not-allowed disabled:bg-[#A79D95]"
        >
          <Upload className="h-4 w-4" aria-hidden />
          Upload
        </button>

        <a
          href="/admin/invitations/template"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-[#D8D5D0] bg-white px-4 text-[13px] font-bold text-[#3F3A37] transition hover:border-[#B68D59] hover:text-[#8D4327]"
        >
          <Download className="h-4 w-4" aria-hidden />
          Template
        </a>
      </form>
    </section>
  );
}

function InvitationsTable({
  invitations,
  siteUrl,
  defaultWhatsappMessage,
}: {
  invitations: InvitationRecord[];
  siteUrl: string;
  defaultWhatsappMessage: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#E6DED6] text-[11px] uppercase tracking-[1px] text-[#7B716B]">
            <th className="py-3 pr-4 font-bold">Nama</th>
            <th className="py-3 pr-4 font-bold">Link</th>
            <th className="py-3 pr-4 font-bold">Custom Message</th>
            <th className="py-3 pr-4 font-bold">Status</th>
            <th className="py-3 pr-4 font-bold">Dibuat</th>
            <th className="py-3 pr-4 font-bold">Diupdate</th>
            <th className="py-3 font-bold" aria-label="Aksi" />
          </tr>
        </thead>
        <tbody>
          {invitations.map((invitation) => {
            const link = `${siteUrl}/i/${invitation.slug}`;
            const shareText = buildInvitationShareText(
              invitation,
              link,
              defaultWhatsappMessage,
            );

            return (
              <tr key={invitation.id} className="border-b border-[#EFEAE5]">
                <td className="max-w-[200px] py-4 pr-4 font-bold text-[#2E2A27]">
                  {invitation.guestName}
                </td>
                <td className="max-w-[260px] py-4 pr-4">
                  <p className="break-all font-semibold text-[#6F625A]">
                    /i/{invitation.slug}
                  </p>
                </td>
                <td className="max-w-[320px] py-4 pr-4 text-[#5F5750]">
                  <p className="line-clamp-3 leading-[20px]">
                    {invitation.customMessage || "-"}
                  </p>
                </td>
                <td className="py-4 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      invitation.isActive
                        ? "bg-[#E8F7EE] text-[#2E7B57]"
                        : "bg-[#ECE8E2] text-[#706A64]"
                    }`}
                  >
                    {invitation.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="py-4 pr-4 font-semibold text-[#6F625A]">
                  {formatAdminDate(invitation.createdAt)}
                </td>
                <td className="py-4 pr-4 font-semibold text-[#6F625A]">
                  {formatAdminDate(invitation.updatedAt)}
                </td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <CopyLinkButton value={link} />
                    <CopyTextButton
                      value={shareText}
                      label="Copy WA"
                      copiedLabel="WA Tersalin"
                      title="Salin teks WhatsApp"
                      variant="message"
                    />

                    <form action={setInvitationStatusAction}>
                      <input type="hidden" name="id" value={invitation.id} />
                      <input
                        type="hidden"
                        name="nextActive"
                        value={String(!invitation.isActive)}
                      />
                      <button
                        type="submit"
                        title={
                          invitation.isActive ? "Nonaktifkan" : "Aktifkan"
                        }
                        className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#D8D5D0] bg-white px-3 text-[#3F3A37] transition hover:border-[#B68D59] hover:text-[#8D4327]"
                      >
                        {invitation.isActive ? (
                          <PauseCircle className="h-4 w-4" aria-hidden />
                        ) : (
                          <PlayCircle className="h-4 w-4" aria-hidden />
                        )}
                      </button>
                    </form>

                    <form action={deleteInvitationAction}>
                      <input type="hidden" name="id" value={invitation.id} />
                      <button
                        type="submit"
                        title="Hapus invitation"
                        className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#E7C7C7] bg-white px-3 text-[#9B3535] transition hover:bg-[#FFF1F1]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function InvitationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=auth");
  }

  const params = await searchParams;
  const search = normalizeText(pickSearchParam(params.q), 120);
  const status = parseStatus(pickSearchParam(params.status));
  const page = pickPositiveInteger(params.page, 1, 1, 9999);
  const pageSize = pickPositiveInteger(params.pageSize, 10, 5, 100);
  const error = resolveAdminMessage(pickSearchParam(params.error));
  const success = resolveAdminMessage(pickSearchParam(params.success));
  const databaseConfigured = isDatabaseConfigured();

  let dataError: string | null = null;
  let pageData = {
    data: [] as InvitationRecord[],
    meta: { page, pageSize, total: 0, pageCount: 1 },
  };
  let stats = { total: 0, active: 0, inactive: 0 };
  let defaultWhatsappMessage = "";

  if (databaseConfigured) {
    try {
      [pageData, stats, defaultWhatsappMessage] = await Promise.all([
        getInvitationsPage({ search, status, page, pageSize }),
        getInvitationStats(),
        getDefaultWhatsappMessage(),
      ]);
    } catch {
      dataError = "Data invitation belum bisa dimuat.";
    }
  } else {
    defaultWhatsappMessage = await getDefaultWhatsappMessage();
  }

  const baseParams = queryParams({
    search,
    status,
    pageSize: pageData.meta.pageSize,
  });

  return (
    <AdminShell active="invitations">
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <StatCard label="Total" value={stats.total} tone="dark" />
        <StatCard label="Aktif" value={stats.active} tone="green" />
        <StatCard label="Nonaktif" value={stats.inactive} tone="muted" />
      </div>

      <div className="mt-5 grid gap-3">
        <AdminNotice
          type="warning"
          message={!databaseConfigured ? "DATABASE_URL belum dikonfigurasi." : null}
        />
        <AdminNotice type="error" message={dataError || error} />
        <AdminNotice type="success" message={success} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[420px_1fr]">
        <InvitationForm disabled={!databaseConfigured} />
        <UploadPanel disabled={!databaseConfigured} />
      </div>

      <section className="mt-5 rounded-[8px] border border-[#DED8CF] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-bold text-[#2E2A27]">
              Data Invitation
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-[#7B716B]">
              {pageData.meta.total} data ditemukan
            </p>
          </div>
        </div>

        <div className="mt-4">
          <InvitationTableControls
            initialSearch={search}
            initialStatus={status}
            initialPageSize={pageData.meta.pageSize}
          />
        </div>

        <div className="mt-5">
          <InvitationsTable
            invitations={pageData.data}
            siteUrl={getSiteUrl()}
            defaultWhatsappMessage={defaultWhatsappMessage}
          />
        </div>

        {!pageData.data.length && (
          <p className="mt-5 rounded-[8px] border border-dashed border-[#D8D1C8] px-4 py-6 text-center text-[13px] font-semibold text-[#7B716B]">
            Data invitation tidak ditemukan.
          </p>
        )}

        <Pagination
          meta={pageData.meta}
          pathname="/admin/invitations"
          params={baseParams}
        />
      </section>
    </AdminShell>
  );
}
