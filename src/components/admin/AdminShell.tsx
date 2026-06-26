import Image from "next/image";
import Link from "next/link";
import { LogOut, Mail, Settings, Users } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";

type AdminMenu = "invitations" | "reservations" | "config";

const menus = [
  {
    key: "invitations",
    label: "Invitation",
    href: "/admin/invitations",
    icon: Mail,
  },
  {
    key: "reservations",
    label: "Reservation",
    href: "/admin/reservations",
    icon: Users,
  },
  {
    key: "config",
    label: "Config",
    href: "/admin/config",
    icon: Settings,
  },
] as const;

export function AdminShell({
  active,
  children,
}: {
  active: AdminMenu;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F6F4F0] px-5 py-6 font-sans text-[#2E2A27] md:px-8 md:py-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="grid gap-5 border-b border-[#DED8CF] pb-5 lg:grid-cols-[180px_1fr_auto] lg:items-end">
          <div className="flex items-center">
            <div className="inline-flex h-[58px] w-[148px] items-center justify-center rounded-[8px] border border-[#6E2B2B] bg-[#3A0909] px-4 shadow-[0_10px_28px_rgba(58,9,9,0.16)]">
              <Image
                src="/Logo Afput HD.png"
                alt="Afdal dan Putri"
                width={340}
                height={144}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Admin menu">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const isActive = menu.key === active;

              return (
                <Link
                  key={menu.key}
                  href={menu.href}
                  className={`inline-flex h-10 items-center gap-2 rounded-[8px] border px-4 text-[13px] font-bold transition ${
                    isActive
                      ? "border-[#4A0E0E] bg-[#4A0E0E] text-white"
                      : "border-[#D8D5D0] bg-white text-[#3F3A37] hover:border-[#B68D59] hover:text-[#8D4327]"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {menu.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[#D8D5D0] bg-white px-4 text-[13px] font-bold text-[#3F3A37] transition hover:border-[#B68D59] hover:text-[#8D4327]"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Keluar
            </button>
          </form>
        </header>

        {children}
      </div>
    </main>
  );
}
