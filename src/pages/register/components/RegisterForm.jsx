import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { LoadingDialog } from "@/components/LoadingDialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";

import { getApiError } from "@/lib/api.error";
import { savePendingRegistration } from "@/utils/registration/pending-registration";
import { registerSchema } from "@/validations/auth.schema";

export function RegisterForm({ onRegister }) {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  function focusNextOnEnter(event, nextField) {
    if (event.key !== "Enter") return;

    event.preventDefault();
    setFocus(nextField);
  }

  async function onSubmit(values) {
    try {
      setServerError("");

      await onRegister(values);
    } catch (error) {
      const apiError = error.apiError ?? getApiError(error);

      if (apiError.code === "REGISTRATION_PENDING") {
        savePendingRegistration({
          email: values.email,
          expiresAt: apiError.expiresAt,
          resendAvailableAt: apiError.resendAvailableAt,
        });

        navigate("/verify-email", {
          replace: true,
        });

        return;
      }

      if (apiError.code === "ALREADY_REGISTERED") {
        setServerError(
          "This email is already registered. Please login instead.",
        );

        return;
      }

      if (apiError.fieldErrors) {
        Object.entries(apiError.fieldErrors).forEach(([field, message]) => {
          setError(field, {
            type: "server",
            message: Array.isArray(message) ? message[0] : message,
          });
        });

        return;
      }

      setServerError(apiError.message);
    }
  }

  return (
    <>
      <LoadingDialog
        open={isSubmitting}
        title="Sending verification code"
        description="Please wait while we send a verification code to your email."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
        aria-busy={isSubmitting}
      >
        <fieldset disabled={isSubmitting} className="space-y-5">
          <FormField id="email" label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              {...register("email")}
              onKeyDown={(event) => focusNextOnEnter(event, "firstName")}
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
                autoComplete="given-name"
                placeholder="First name"
                {...register("firstName")}
                onKeyDown={(event) => focusNextOnEnter(event, "lastName")}
              />
            </FormField>

            <FormField
              id="lastName"
              label="Last name"
              error={errors.lastName?.message}
            >
              <Input
                id="lastName"
                autoComplete="family-name"
                placeholder="Last name"
                {...register("lastName")}
                onKeyDown={(event) => focusNextOnEnter(event, "password")}
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
              placeholder="Create a password"
              {...register("password")}
              onKeyDown={(event) => focusNextOnEnter(event, "confirmPassword")}
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

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </fieldset>
      </form>

      <div className="mt-4 text-center">
        <Link
          to="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to home
        </Link>
      </div>
    </>
  );
}
