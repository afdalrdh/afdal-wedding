import { WeddingPage } from "@/components/WeddingPage";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <WeddingPage invitationSlug={slug} />;
}
