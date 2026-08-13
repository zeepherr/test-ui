import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";

import { login } from "@/api/auth/auth.api";
import { establishSession } from "@/api/auth/auth.session";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { getRoleHome } from "@/constants/role";
import { AuthLayout } from "@/layouts/auth.layout";
import { getApiError } from "@/lib/api.error";
import { loginSchema } from "@/validations/auth.schema";
import { toast } from "sonner";

export default function LoginPage() {
  const [serverError, setServerError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      identity: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      setServerError("");

      // 1. Login request
      const data = await login(values);

      // 2. Save accessToken + user into Zustand
      const user = await establishSession(data);

      // 3. Redirect by role
      navigate(getRoleHome(user.role), {
        replace: true,
      });
      toast.success(data.message, { position: "top-center" });
    } catch (error) {
      const apiError = error.apiError ?? getApiError(error);
      setServerError(apiError.message);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Login using your email or phone number."
      footerText="Don't have an account?"
      footerLinkText="Register"
      footerLinkTo="/register"
    >
      {location.state?.registered && (
        <div className="mb-5 rounded-lg border border-border bg-muted p-3 text-sm">
          Registration successful. You can now login.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          id="identity"
          label="Email or phone number"
          error={errors.identity?.message}
        >
          <Input
            id="identity"
            type="text"
            autoComplete="username"
            placeholder="name@example.com"
            {...register("identity")}
          />
        </FormField>

        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register("password")}
          />
        </FormField>

        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to home
        </Link>
      </div>
    </AuthLayout>
  );
}
