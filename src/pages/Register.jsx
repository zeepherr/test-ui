import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { register as registerUser } from "@/api/auth/auth.api";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/layouts/auth.layout";
import { registerSchema } from "@/validations/auth.schema";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      identity: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    try {
      setServerError("");

      await registerUser(values);

      navigate("/login", {
        replace: true,

        state: {
          registered: true,
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to create account. Please try again.";

      setServerError(message);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Register as a motorcycle shop member."
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkTo="/login"
    >
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
            placeholder="name@example.com or 0812345678"
            {...register("identity")}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="firstName"
            label="First name"
            error={errors.firstName?.message}
          >
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              {...register("firstName")}
            />
          </FormField>

          <FormField
            id="lastName"
            label="Last name"
            error={errors.lastName?.message}
          >
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              {...register("lastName")}
            />
          </FormField>
        </div>

        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 4 characters"
            {...register("password")}
          />
        </FormField>

        <FormField
          id="confirmPassword"
          label="Confirm password"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            {...register("confirmPassword")}
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
          {isSubmitting ? "Creating account..." : "Create account"}
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
