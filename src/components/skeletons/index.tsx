import Skeleton from "@/components/ui/Skeleton";

/** Kerangka navbar supaya layout tidak loncat saat halaman muncul. */
export function NavSkeleton() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:px-4">
        <span className="font-display text-xl font-bold tracking-tight">CV<span className="text-brand">ku</span></span>
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-6 w-20 sm:block" />
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </header>
  );
}

const Main = ({ children }: { children: React.ReactNode }) => (
  <main role="status" aria-label="Memuat halaman" className="mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-10">{children}</main>
);

export function PageSkeleton() {
  return (
    <>
      <NavSkeleton />
      <Main>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </Main>
    </>
  );
}

export function GallerySkeleton() {
  return (
    <>
      <NavSkeleton />
      <Main>
        <Skeleton className="mx-auto h-9 w-72 max-w-full" />
        <Skeleton className="mx-auto mt-3 h-4 w-96 max-w-full" />
        <div className="mt-6 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />)}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5]" />)}
        </div>
      </Main>
    </>
  );
}

export function DashboardSkeleton() {
  const Row = () => (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <div className="flex-1 space-y-2"><Skeleton className="h-4 w-48 max-w-full" /><Skeleton className="h-3 w-32" /></div>
      <Skeleton className="h-8 w-16" />
    </div>
  );
  return (
    <>
      <NavSkeleton />
      <Main>
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        <Skeleton className="mt-8 h-3 w-28" />
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-32" />)}
        </div>
        <Skeleton className="mt-10 h-3 w-24" />
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white"><Row /><Row /><Row /></div>
        <Skeleton className="mt-12 h-3 w-32" />
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white"><Row /><Row /></div>
      </Main>
    </>
  );
}

export function PricingSkeleton() {
  return (
    <>
      <NavSkeleton />
      <Main>
        <Skeleton className="mx-auto h-9 w-56" />
        <Skeleton className="mx-auto mt-3 h-4 w-80 max-w-full" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[420px] rounded-2xl" />)}
        </div>
      </Main>
    </>
  );
}

export function EditorSkeleton() {
  return (
    <div role="status" aria-label="Memuat editor" className="h-app flex flex-col">
      <div className="flex items-center gap-3 border-b border-line bg-white px-3 py-3 sm:px-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-7 flex-1" />
        <Skeleton className="hidden h-8 w-40 sm:block" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(340px,1fr)_1fr] lg:grid-cols-[minmax(380px,1fr)_1.1fr]">
        <div className="space-y-4 overflow-hidden p-4">
          <Skeleton className="h-10" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-line bg-white p-4">
              <Skeleton className="h-4 w-32" />
              <div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
              <Skeleton className="h-10" />
            </div>
          ))}
        </div>
        <div className="hidden bg-[#e9e5dd] p-8 md:block">
          <Skeleton className="mx-auto aspect-[210/297] w-full max-w-[680px] rounded-sm bg-white/80" />
        </div>
      </div>
    </div>
  );
}

export function CardEditorSkeleton() {
  return (
    <div role="status" aria-label="Memuat editor kartu" className="min-h-app">
      <div className="flex items-center gap-3 border-b border-line bg-white px-3 py-3 sm:px-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 flex-1" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-14" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_420px] lg:p-8">
        <div className="order-2 space-y-4 md:order-1">
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-2 overflow-hidden">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-20 shrink-0" />)}</div>
          <Skeleton className="h-10" /><Skeleton className="h-24" /><Skeleton className="h-10" />
        </div>
        <Skeleton className="order-1 aspect-[4/5] w-full md:order-2" />
      </div>
    </div>
  );
}

export function PaySkeleton() {
  return (
    <main role="status" aria-label="Memuat pembayaran" className="mx-auto max-w-md px-4 py-8">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="mt-6 h-8 w-56" />
      <div className="mt-5 grid grid-cols-2 gap-3"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
      <Skeleton className="mt-6 h-80 rounded-2xl" />
    </main>
  );
}

export function TableSkeleton() {
  return (
    <>
      <NavSkeleton />
      <Main>
        <Skeleton className="h-9 w-40" />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        <div className="mt-8 space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
      </Main>
    </>
  );
}

export function TextSkeleton() {
  return (
    <>
      <NavSkeleton />
      <main role="status" aria-label="Memuat halaman" className="mx-auto max-w-3xl space-y-3 px-4 py-10">
        <Skeleton className="h-9 w-64" />
        {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />)}
      </main>
    </>
  );
}
