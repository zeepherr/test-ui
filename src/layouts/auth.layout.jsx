import { Link } from "react-router";

import { ThemeSwitcher } from "@/components/theme/ThemeToggle";
export function AuthLayout({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute right-6 top-6">
        <ThemeSwitcher />
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="text-xl font-semibold">
            MotorShop
          </Link>

          <div className="max-w-lg space-y-4">
            <h2 className="text-4xl font-semibold tracking-tight">
              Motorcycle shop management, made simple.
            </h2>

            <p className="text-primary-foreground/80">
              Manage members, products, services, motorcycles and sales from one
              place.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/60">
            Motorcycle Shop Management System
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

              <p className="text-muted-foreground">{description}</p>
            </div>

            {children}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {footerText}
              <Link
                to={footerLinkTo}
                className="font-medium text-primary hover:underline"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
