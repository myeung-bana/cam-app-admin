export function DevModeBanner() {
  if (process.env.NEXT_PUBLIC_DEV_MODE !== "true") return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      Dev mode — using local mock data. Set{" "}
      <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_DEV_MODE=false</code>{" "}
      and configure Nhost to use the real backend.
    </div>
  );
}
