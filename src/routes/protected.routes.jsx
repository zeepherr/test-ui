import { Navigate, Outlet, useLocation } from "react-router";

import { FullPageLoader } from "@/components/auth/FullPageLoader";
import { useAuthStore } from "@/stores/auth.store";
export function ProtectedRoute() {
  const location = useLocation();

  const status = useAuthStore((state) => state.status);

  if (status === "checking") {
    return <FullPageLoader />;
  }

  if (status !== "authenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}
