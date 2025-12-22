import SearchPage from "../components/Pages/Search";

type SearchParams = {
  keyword?: string | string[];
  page?: string | string[];
};

export default async function SearchRoutePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const keyword = typeof sp?.keyword === "string" ? sp.keyword : "";

  const pageRaw = typeof sp?.page === "string" ? Number(sp.page) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  return <SearchPage keyword={keyword} page={page} />;
}
