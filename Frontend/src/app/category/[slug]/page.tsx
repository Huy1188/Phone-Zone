import CategoryPage from "@/app/components/Pages/Category/index";
import { notFound } from "next/navigation";

export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();
  return <CategoryPage slug={slug} />;
}
