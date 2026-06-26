import { WeddingPage } from "@/components/WeddingPage";
import { normalizeSlug, pickSearchParam } from "@/lib/wedding-validation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const invitationSlug = normalizeSlug(
    pickSearchParam(params.to) || pickSearchParam(params.invite),
  );

  return <WeddingPage invitationSlug={invitationSlug} />;
}
