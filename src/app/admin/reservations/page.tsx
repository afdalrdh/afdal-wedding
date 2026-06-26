import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarCheck, Mail, Trash2, Users } from "lucide-react";
import { deleteReservationAction } from "../actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { Pagination } from "@/components/admin/Pagination";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { formatAdminDate, resolveAdminMessage } from "@/lib/admin-display";
import {
  getAdminReservationsPage,
  getReservationStats,
  isDatabaseConfigured,
} from "@/lib/wedding-data";
import type { ReservationRecord } from "@/lib/wedding-types";
import { pickPositiveInteger, pickSearchParam } from "@/lib/wedding-validation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Reservation",
  description: "Kelola data reservation.",
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-[8px] border border-[#DED8CF] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-bold uppercase tracking-[1px] text-[#7B716B]">
          {label}
        </span>
        <Icon className="h-5 w-5 text-[#8D4327]" aria-hidden />
      </div>
      <p className="mt-3 text-[30px] font-bold leading-none text-[#2E2A27]">
        {value}
      </p>
    </div>
  );
}

function ReservationsTable({
  reservations,
}: {
  reservations: ReservationRecord[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#E6DED6] text-[11px] uppercase tracking-[1px] text-[#7B716B]">
            <th className="py-3 pr-4 font-bold">Nama</th>
            <th className="py-3 pr-4 font-bold">Kehadiran</th>
            <th className="py-3 pr-4 font-bold">Lokasi</th>
            <th className="py-3 pr-4 font-bold">Ucapan</th>
            <th className="py-3 pr-4 font-bold">Waktu</th>
            <th className="py-3 font-bold" aria-label="Aksi" />
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b border-[#EFEAE5]">
              <td className="max-w-[150px] py-4 pr-4 font-bold text-[#2E2A27]">
                {reservation.name}
              </td>
              <td className="py-4 pr-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    reservation.attendance === "Hadir"
                      ? "bg-[#E8F7EE] text-[#2E7B57]"
                      : "bg-[#ECE8E2] text-[#706A64]"
                  }`}
                >
                  {reservation.attendance}
                </span>
              </td>
              <td className="max-w-[120px] py-4 pr-4 font-semibold text-[#6F625A]">
                {reservation.location || "-"}
              </td>
              <td className="max-w-[300px] py-4 pr-4 text-[#5F5750]">
                <p className="line-clamp-2 leading-[20px]">
                  {reservation.message}
                </p>
              </td>
              <td className="py-4 pr-4 font-semibold text-[#6F625A]">
                {formatAdminDate(reservation.createdAt)}
              </td>
              <td className="py-4">
                <form action={deleteReservationAction}>
                  <input type="hidden" name="id" value={reservation.id} />
                  <button
                    type="submit"
                    title="Hapus reservasi"
                    className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#E7C7C7] bg-white px-3 text-[#9B3535] transition hover:bg-[#FFF1F1]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=auth");
  }

  const params = await searchParams;
  const page = pickPositiveInteger(params.page, 1, 1, 9999);
  const pageSize = pickPositiveInteger(params.pageSize, 25, 5, 100);
  const error = resolveAdminMessage(pickSearchParam(params.error));
  const databaseConfigured = isDatabaseConfigured();

  let dataError: string | null = null;
  let pageData = {
    data: [] as ReservationRecord[],
    meta: { page, pageSize, total: 0, pageCount: 1 },
  };
  let stats = { total: 0, present: 0, absent: 0 };

  if (databaseConfigured) {
    try {
      [pageData, stats] = await Promise.all([
        getAdminReservationsPage({ page, pageSize }),
        getReservationStats(),
      ]);
    } catch {
      dataError = "Data reservasi belum bisa dimuat.";
    }
  }

  return (
    <AdminShell active="reservations">
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <StatCard label="Reservasi" value={stats.total} icon={Users} />
        <StatCard label="Hadir" value={stats.present} icon={CalendarCheck} />
        <StatCard label="Tidak Hadir" value={stats.absent} icon={Mail} />
      </div>

      <div className="mt-5 grid gap-3">
        <AdminNotice
          type="warning"
          message={
            !databaseConfigured ? "DATABASE_URL belum dikonfigurasi." : null
          }
        />
        <AdminNotice type="error" message={dataError || error} />
      </div>

      <section className="mt-5 rounded-[8px] border border-[#DED8CF] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-bold text-[#2E2A27]">
              Data Reservation
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-[#7B716B]">
              {pageData.meta.total} data ditemukan
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ReservationsTable reservations={pageData.data} />
        </div>

        {!pageData.data.length && (
          <p className="mt-5 rounded-[8px] border border-dashed border-[#D8D1C8] px-4 py-6 text-center text-[13px] font-semibold text-[#7B716B]">
            Data reservation tidak ditemukan.
          </p>
        )}

        <Pagination
          meta={pageData.meta}
          pathname="/admin/reservations"
          params={{ pageSize: String(pageData.meta.pageSize) }}
        />
      </section>
    </AdminShell>
  );
}
