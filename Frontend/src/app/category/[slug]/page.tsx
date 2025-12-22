import CategoryPage from "@/app/components/Pages/Category/index";
import { fetchProductsByCategorySlug } from "@/services/category"; // hoặc "@/services/products"
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategorySlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : undefined;

  if (!slug) notFound();

  // ✅ Option A: Fetch FULL list theo category (không page/limit/sort)
  const initialProducts = await fetchProductsByCategorySlug(slug);

  return <CategoryPage slug={slug} searchParams={sp} initialProducts={initialProducts} />;
}
