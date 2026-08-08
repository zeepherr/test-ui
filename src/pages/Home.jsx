import { Link } from "react-router";

import { SiteHeader } from "@/components/ui/SiteHeader";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
              Motorcycle Shop Management
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Manage your motorcycle shop from one system.
            </h1>

            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Manage products, services, members, motorcycles, orders and shop
              sales efficiently.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" render={<Link to="/register" />}>
                Create member account
              </Button>

              <Button size="lg" variant="outline" render={<Link to="/login" />}>
                Login
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                title="Products"
                description="Manage inventory and product stock."
              />

              <FeatureCard
                title="Services"
                description="Manage motorcycle services and pricing."
              />

              <FeatureCard
                title="POS"
                description="Process products and service sales."
              />

              <FeatureCard
                title="Members"
                description="Track member orders and spending."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-5">
      <h2 className="font-medium">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}
