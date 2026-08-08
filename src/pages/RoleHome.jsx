import { LogoutButton } from "@/components/LogoutButton";
import { useAuthStore } from "@/stores/auth.store";
export default function RoleHomePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Signed in as</p>

          <h1 className="text-3xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h1>

          <p className="mt-2 text-primary">{user?.role}</p>
        </div>

        <LogoutButton />
      </div>
    </main>
  );
}
