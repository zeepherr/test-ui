import { Navigate, useNavigate } from "react-router";

import { AuthLayout } from "@/layouts/auth.layout";
import {
  clearPendingRegistration,
  getPendingRegistration,
} from "@/utils/registration/pending-registration";
import { VerifyEmailForm } from "./components/VerifyEmailForm";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const pending = getPendingRegistration();

  if (!pending) {
    return <Navigate to="/register" replace />;
  }

  function handleVerified() {
    clearPendingRegistration();

    navigate("/login", {
      replace: true,
      state: {
        verified: true,
      },
    });
  }
  function handleAttemptsExceeded() {
    clearPendingRegistration();

    navigate("/register", {
      replace: true,
      state: {
        verificationFailed: true,
      },
    });
  }

  return (
    <AuthLayout
      title="Verify your email"
      description={`We sent a 6-digit verification code to ${pending.email}`}
      footerText="Wrong email?"
      footerLinkText="Register again"
      footerLinkTo="/register"
    >
      <VerifyEmailForm
        expiresAt={pending.expiresAt}
        email={pending.email}
        resendAvailableAt={pending.resendAvailableAt}
        onVerified={handleVerified}
        onAttemptsExceeded={handleAttemptsExceeded}
      />
    </AuthLayout>
  );
}
