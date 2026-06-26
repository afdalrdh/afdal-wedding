import { CheckCircle2, Database } from "lucide-react";
import { loginAdmin } from "@/app/admin/actions";
import { getAdminUsername } from "@/lib/admin-auth";

export function AdminLogin({
  configured,
  error,
}: {
  configured: boolean;
  error: string | null;
}) {
  return (
    <main className="min-h-screen bg-[#F6F4F0] px-5 py-10 font-sans text-[#2E2A27] md:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[420px] flex-col justify-center">
        <div className="rounded-[8px] border border-[#DED8CF] bg-white p-6 shadow-[0_18px_45px_rgba(48,42,36,0.08)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#4A0E0E] text-white">
            <Database className="h-5 w-5" aria-hidden />
          </div>

          <h1 className="mt-6 text-[24px] font-bold leading-[30px] text-[#2E2A27]">
            Admin Wedding
          </h1>

          {!configured && (
            <p className="mt-4 rounded-[8px] border border-[#E5C48F] bg-[#FFF8E9] px-4 py-3 text-[13px] font-semibold leading-[20px] text-[#7B4E13]">
              ADMIN_PASSWORD belum dikonfigurasi.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-[8px] border border-[#F0C1C1] bg-[#FFF1F1] px-4 py-3 text-[13px] font-semibold leading-[20px] text-[#9B3535]">
              {error}
            </p>
          )}

          <form action={loginAdmin} className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-[12px] font-bold uppercase tracking-[1px] text-[#6F625A]">
                Username
              </span>
              <input
                name="username"
                defaultValue={getAdminUsername()}
                autoComplete="username"
                className="h-11 rounded-[8px] border border-[#D9D4CD] bg-[#FBFAF8] px-3 text-[14px] font-semibold outline-none transition focus:border-[#8D4327] focus:ring-2 focus:ring-[#E8C8C7]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[12px] font-bold uppercase tracking-[1px] text-[#6F625A]">
                Password
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="h-11 rounded-[8px] border border-[#D9D4CD] bg-[#FBFAF8] px-3 text-[14px] font-semibold outline-none transition focus:border-[#8D4327] focus:ring-2 focus:ring-[#E8C8C7]"
              />
            </label>

            <button
              type="submit"
              disabled={!configured}
              className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#4A0E0E] px-4 text-[14px] font-bold text-white transition hover:bg-[#3C0B0B] disabled:cursor-not-allowed disabled:bg-[#A79D95]"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Masuk
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
