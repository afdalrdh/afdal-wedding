import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createInvitationTemplateBuffer } from "@/lib/invitation-excel";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const buffer = await createInvitationTemplateBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="solid-wedding-invitation-template.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
