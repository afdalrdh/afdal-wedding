import { ClosingSection } from "@/components/ClosingSection";
import { CountdownSection } from "@/components/CountdownSection";
import { EnvelopeSection } from "@/components/EnvelopeSection";
import { GallerySection } from "@/components/GallerySection";
import { GiftSection } from "@/components/GiftSection";
import { HeroSection } from "@/components/HeroSection";
import { InvitationSection } from "@/components/InvitationSection";
import { RSVPSection } from "@/components/RSVPSection";
import { StorySection } from "@/components/StorySection";
import { VenueSection } from "@/components/VenueSection";
import {
  getActiveInvitationBySlug,
  getPublicReservations,
  getReservationStats,
} from "@/lib/wedding-data";
import type {
  InvitationRecord,
  ReservationRecord,
  ReservationStats,
} from "@/lib/wedding-types";

const DEFAULT_GUEST_NAME = "Aldy Akbarrizky";

interface WeddingPageProps {
  invitationSlug?: string | null;
}

export async function WeddingPage({ invitationSlug }: WeddingPageProps) {
  let invitation: InvitationRecord | null = null;
  let reservations: ReservationRecord[] = [];
  let stats: ReservationStats = { total: 0, present: 0, absent: 0 };
  let dataUnavailable = false;

  try {
    [invitation, reservations, stats] = await Promise.all([
      getActiveInvitationBySlug(invitationSlug),
      getPublicReservations(8),
      getReservationStats(),
    ]);
  } catch {
    dataUnavailable = true;
  }

  const guestName = invitation?.guestName || DEFAULT_GUEST_NAME;

  return (
    <main className="bg-[#f5f0e8] text-neutral-950">
      <HeroSection />

      <InvitationSection />

      <StorySection />

      <CountdownSection />

      <VenueSection />

      <GallerySection />

      <RSVPSection
        initialWishes={reservations}
        initialAttendanceCount={stats.present}
        initialReservationCount={stats.total}
        invitationSlug={invitation?.slug}
        invitationName={invitation?.guestName}
        dataUnavailable={dataUnavailable}
      />

      <GiftSection />

      <ClosingSection />

      <EnvelopeSection guestName={guestName} />
    </main>
  );
}
