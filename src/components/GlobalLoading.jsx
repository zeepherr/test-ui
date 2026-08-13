import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import "../index.css";
export function GlobalLoadingBar() {
  const isLoading = useUiStore((state) => state.pendingRequests > 0);
  const authStatus = useAuthStore((state) => state.status);
  if (!isLoading || authStatus === "checking") {
    return null;
  }

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="fixed inset-x-0 top-0 z-100 h-1 overflow-hidden bg-primary/20"
    >
      <div className="h-full global-loading-indicator bg-primary" />
    </div>
  );
}
