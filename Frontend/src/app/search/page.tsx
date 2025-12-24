import SearchPage from "../components/Pages/Search";

type SearchParams = { q?: string | string[]; page?: string | string[]; sort?: string | string[] };

export default async function SearchRoutePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const q = typeof sp?.q === "string" ? sp.q : "";
  
  const sort = typeof sp?.sort === "string" ? sp.sort : "newest";
  const pageRaw = typeof sp?.page === "string" ? Number(sp.page) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  return <SearchPage keyword={q} page={page} sort={sort}/>;
}
