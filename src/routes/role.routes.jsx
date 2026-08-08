import { Navigate, Outlet } from "react-router";

import { useAuthStore } from "@/stores/auth.store";

import { getRoleHome } from "@/constants/role";
export function RoleRoute({ allowedRoles }) {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return <Outlet />;
}
