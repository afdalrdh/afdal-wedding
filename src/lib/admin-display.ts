const ERROR_MESSAGES: Record<string, string> = {
  auth: "Silakan login sebagai admin.",
  invalid: "Username atau password salah.",
};

export function formatAdminDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function resolveAdminMessage(message: string | null) {
  if (!message) return null;
  return ERROR_MESSAGES[message] || message;
}
