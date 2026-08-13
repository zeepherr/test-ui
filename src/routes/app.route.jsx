import { createBrowserRouter } from "react-router";

import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/register/Register";
import RoleHomePage from "@/pages/RoleHome";

import { ProtectedRoute } from "./protected.routes";
import { RoleRoute } from "./role.routes";

import { ROLES } from "@/constants/role";
import VerifyEmailPage from "@/pages/verify/VerifyEmail";
const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/verify-email",
    Component: VerifyEmailPage,
  },
  // Protected routes
  {
    Component: ProtectedRoute,

    children: [
      // Admin
      {
        element: <RoleRoute allowedRoles={[ROLES.ADMIN]} />,

        children: [
          {
            path: "/admin",
            Component: RoleHomePage,
          },
        ],
      },

      // Staff
      {
        element: <RoleRoute allowedRoles={[ROLES.STAFF]} />,

        children: [
          {
            path: "/staff",
            Component: RoleHomePage,
          },
        ],
      },

      // Member
      {
        element: <RoleRoute allowedRoles={[ROLES.MEMBER]} />,

        children: [
          {
            path: "/member",
            Component: RoleHomePage,
          },
        ],
      },
    ],
  },
]);

export default router;
