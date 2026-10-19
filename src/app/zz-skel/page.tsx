import * as S from "@/components/skeletons";
import Spinner from "@/components/ui/Spinner";
export default async function P({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  if (s === "btn") return <div className="p-6 flex gap-3"><button className="btn-primary" disabled><Spinner />Membuat PDF…</button><button className="btn-ghost" disabled><Spinner />Membuat…</button><button className="btn-gold" disabled><Spinner/>Membuka…</button></div>;
  const C = (S as Record<string, () => React.JSX.Element>)[s ?? "DashboardSkeleton"];
  return <C />;
}
