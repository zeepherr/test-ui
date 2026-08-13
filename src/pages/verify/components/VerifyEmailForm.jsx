import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { verifyRegistrationEmail } from "@/api/auth/auth.api";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { getApiError } from "@/lib/api.error";

import { verifyEmailSchema } from "@/validations/auth.schema";
import { OtpCountdown } from "./OtpCountdown";
import { ResendCodeButton } from "./ResendCodeButton";

export function VerifyEmailForm({
  email,
  onVerified,
  onAttemptsExceeded,
  expiresAt,
  resendAvailableAt,
}) {
  const [serverError, setServerError] = useState("");

  const [attemptsRemaining, setAttemptsRemaining] = useState(null);

  const [verificationBlocked, setVerificationBlocked] = useState(false);

  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setFocus,
    resetField,

    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),

    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values) {
    try {
      setServerError("");
      setAttemptsRemaining(null);

      await verifyRegistrationEmail({
        email,
        code: values.code,
      });

      onVerified();
    } catch (error) {
      const apiError = error.apiError ?? getApiError(error);

      handleVerificationError(apiError);
    }
  }

  function handleVerificationError(apiError) {
    switch (apiError.code) {
      case "INVALID_VERIFICATION_CODE":
        if (apiError.attemptsRemaining === 0) {
          onAttemptsExceeded();
          return;
        }
        setError("code", {
          type: "server",
          message: apiError.message,
        });

        setAttemptsRemaining(apiError.attemptsRemaining);

        setFocus("code");
        break;

      case "VERIFICATION_CODE_EXPIRED":
      case "TOO_MANY_VERIFICATION_ATTEMPTS":
        onAttemptsExceeded();
        return;

      default:
        setServerError(apiError.message);
    }
  }

  function handleResent() {
    setServerError("");
    setAttemptsRemaining(null);
    setVerificationBlocked(false);
    setCanResend(false);

    clearErrors("code");
    resetField("code");
    setFocus("code");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          id="code"
          label="Verification code"
          error={errors.code?.message}
        >
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            disabled={verificationBlocked}
            className="text-center text-lg tracking-[0.5em]"
            {...register("code")}
          />
        </FormField>
        <OtpCountdown
          expiresAt={expiresAt}
          onExpired={() => {
            setVerificationBlocked(true);
            setCanResend(true);
            setServerError(
              "Your verification code has expired. Please request a new code.",
            );
          }}
        />

        {attemptsRemaining !== null && (
          <p className="text-sm text-muted-foreground">
            {attemptsRemaining} attempts remaining
          </p>
        )}

        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || verificationBlocked}
        >
          {isSubmitting ? "Verifying..." : "Verify email"}
        </Button>
      </form>

      <ResendCodeButton
        email={email}
        resendAvailableAt={resendAvailableAt}
        canResend={canResend}
        onResent={handleResent}
      />
    </div>
  );
}
