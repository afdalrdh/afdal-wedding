import {
  createReservation,
  getPublicReservations,
  getReservationStats,
  MissingDatabaseUrlError,
} from "@/lib/wedding-data";
import { validateReservationPayload } from "@/lib/wedding-validation";

export const dynamic = "force-dynamic";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function GET() {
  try {
    const [reservations, stats] = await Promise.all([
      getPublicReservations(12),
      getReservationStats(),
    ]);

    return Response.json({ reservations, stats });
  } catch {
    return jsonError("Data reservasi belum bisa dimuat.", 500);
  }
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Payload tidak valid.", 400);
  }

  const validation = validateReservationPayload(payload);
  if (!validation.ok) {
    return jsonError(validation.error, 400);
  }

  try {
    const reservation = await createReservation(validation.data);
    return Response.json({ reservation }, { status: 201 });
  } catch (error) {
    if (error instanceof MissingDatabaseUrlError) {
      return jsonError("DATABASE_URL belum dikonfigurasi.", 503);
    }

    return jsonError("Reservasi belum bisa disimpan.", 500);
  }
}
