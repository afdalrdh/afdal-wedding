import { AdminAlert } from "./AdminAlert";

export function AdminNotice({
  type,
  message,
}: {
  type: "error" | "success" | "warning";
  message: string | null;
}) {
  if (!message) return null;

  const className =
    type === "success"
      ? "border-[#B9DFC8] bg-[#EEF9F2] text-[#2E7B57]"
      : type === "warning"
        ? "border-[#E5C48F] bg-[#FFF8E9] text-[#7B4E13]"
        : "border-[#F0C1C1] bg-[#FFF1F1] text-[#9B3535]";

  return (
    <>
      <AdminAlert type={type} message={message} />
      <p
        className={`rounded-[8px] border px-4 py-3 text-[13px] font-semibold leading-[20px] ${className}`}
      >
        {message}
      </p>
    </>
  );
}
