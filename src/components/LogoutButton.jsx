import { useState } from "react";
import { useNavigate } from "react-router";

import { logout } from "@/api/auth/auth.api";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export function LogoutButton() {
  const navigate = useNavigate();

  const clearSession = useAuthStore((state) => state.clearSession);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      const data = await logout();
      toast.success(data.message, { position: "top-center" });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Client must still log out
      clearSession();

      navigate("/login", {
        replace: true,
      });

      setIsLoggingOut(false);
    }
  }

  return (
    <Button variant="outline" disabled={isLoggingOut} onClick={handleLogout}>
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
}
