import { useEffect, useState } from "react";

import { resendRegistrationOtp } from "@/api/auth/auth.api";
import { Button } from "@/components/ui/button";
import { getApiError } from "@/lib/api.error";

import {
  getPendingRegistration,
  savePendingRegistration,
} from "@/utils/registration/pending-registration";

function getRemainingSeconds(resendAvailableAt) {
  if (!resendAvailableAt) return 0;

  const resendTime = new Date(resendAvailableAt).getTime();

  if (Number.isNaN(resendTime)) return 0;

  const remaining = resendTime - Date.now();

  return Math.max(Math.ceil(remaining / 1000), 0);
}

function createResendAvailableAt(seconds) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export function ResendCodeButton({ email, resendAvailableAt, onResent }) {
  const [resendAt, setResendAt] = useState(resendAvailableAt);

  const [countdown, setCountdown] = useState(() =>
    getRemainingSeconds(resendAvailableAt),
  );

  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    function updateCountdown() {
      const remaining = getRemainingSeconds(resendAt);

      setCountdown(remaining);

      return remaining;
    }

    const remaining = updateCountdown();

    if (remaining === 0) return;

    const timer = setInterval(() => {
      const current = updateCountdown();

      if (current === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resendAt]);

  async function handleResend() {
    try {
      setError("");
      setIsSending(true);

      const data = await resendRegistrationOtp({
        email,
      });

      const nextResendAt =
        data.resendAvailableAt ??
        createResendAvailableAt(data.resendAfterSeconds ?? 60);

      setResendAt(nextResendAt);

      const pending = getPendingRegistration();

      savePendingRegistration({
        ...(pending ?? {}),
        email,

        expiresAt: data.expiresAt ?? pending?.expiresAt,

        resendAvailableAt: nextResendAt,
      });

      onResent?.({
        ...data,
        resendAvailableAt: nextResendAt,
      });
    } catch (error) {
      const apiError = error.apiError ?? getApiError(error);

      if (apiError.code === "OTP_RESEND_COOLDOWN") {
        const nextResendAt = createResendAvailableAt(
          apiError.retryAfterSeconds ?? 0,
        );

        setResendAt(nextResendAt);

        const pending = getPendingRegistration();

        savePendingRegistration({
          ...(pending ?? {}),
          email,
          resendAvailableAt: nextResendAt,
        });

        return;
      }

      setError(apiError.message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-2 text-center">
      <Button
        type="button"
        variant="ghost"
        disabled={countdown > 0 || isSending}
        onClick={handleResend}
      >
        {isSending
          ? "Sending..."
          : countdown > 0
            ? `Resend code in ${countdown}s`
            : "Resend code"}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
