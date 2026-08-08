import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "../theme/ThemeToggle";
export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-semibold tracking-tight">
          MotorShop
        </Link>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          <Button variant="ghost" render={<Link to="/login" />}>
            Login
          </Button>

          <Button render={<Link to="/register" />}>Register</Button>
        </div>
      </div>
    </header>
  );
}
