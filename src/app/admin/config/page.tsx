import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MessageCircle, Save } from "lucide-react";
import { updateDefaultWhatsappMessageAction } from "../actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { WhatsappMessageEditor } from "@/components/admin/WhatsappMessageEditor";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { resolveAdminMessage } from "@/lib/admin-display";
import {
  getDefaultWhatsappMessage,
  isDatabaseConfigured,
} from "@/lib/wedding-data";
import { pickSearchParam } from "@/lib/wedding-validation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Config",
  description: "Konfigurasi pesan WhatsApp.",
};

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

export default async function AdminConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=auth");
  }

  const params = await searchParams;
  const databaseConfigured = isDatabaseConfigured();
  const error = resolveAdminMessage(pickSearchParam(params.error));
  const success = resolveAdminMessage(pickSearchParam(params.success));
  const defaultMessage = await getDefaultWhatsappMessage();

  return (
    <AdminShell active="config">
      <div className="mt-5 grid gap-3">
        <AdminNotice
          type="warning"
          message={!databaseConfigured ? "DATABASE_URL belum dikonfigurasi." : null}
        />
        <AdminNotice type="error" message={error} />
        <AdminNotice type="success" message={success} />
      </div>

      <section className="mt-5 rounded-[8px] border border-[#DED8CF] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#F4EDE9] text-[#8D4327]">
            <MessageCircle className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-[#2E2A27]">
              Default WhatsApp Message
            </h2>
            <p className="mt-1 text-[12px] font-semibold leading-[18px] text-[#7B716B]">
              Dipakai saat invitation tidak memiliki custom message.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[8px] border border-[#E4D7C2] bg-[#FFF8E9] px-4 py-3 text-[13px] font-semibold leading-[21px] text-[#6F4A1C]">
          Gunakan <code className="font-bold text-[#3F2F20]">{`{{nama}}`}</code>{" "}
          untuk posisi nama tamu dan{" "}
          <code className="font-bold text-[#3F2F20]">{`{{link}}`}</code> untuk
          posisi link undangan. Format WhatsApp tersedia:{" "}
          <span className="font-bold">*tebal*</span>,{" "}
          <span className="font-bold">_miring_</span>,{" "}
          <span className="font-bold">~coret~</span>, dan{" "}
          <span className="font-bold">```monospace```</span>.
        </div>

        <form action={updateDefaultWhatsappMessageAction} className="mt-5">
          <div className="grid gap-2">
            <label
              htmlFor="defaultWhatsappMessage"
              className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[1px] text-[#6F625A]"
            >
              Pesan WA Default
              <FieldMeta type="required" />
            </label>
            <WhatsappMessageEditor
              id="defaultWhatsappMessage"
              name="defaultMessage"
              defaultValue={defaultMessage}
              disabled={!databaseConfigured}
            />
          </div>

          <button
            type="submit"
            disabled={!databaseConfigured}
            className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#4A0E0E] px-4 text-[14px] font-bold text-white transition hover:bg-[#3C0B0B] disabled:cursor-not-allowed disabled:bg-[#A79D95]"
          >
            <Save className="h-4 w-4" aria-hidden />
            Simpan Config
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
