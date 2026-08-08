import { useUiStore } from "@/stores/ui.store";
export function GlobalLoadingBar() {
  const isLoading = useUiStore((state) => state.pendingRequests > 0);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="fixed inset-x-0 top-0 z-100 h-1 overflow-hidden bg-primary/20"
    >
      <div className="h-full w-1/2 animate-pulse bg-primary" />
    </div>
  );
}
