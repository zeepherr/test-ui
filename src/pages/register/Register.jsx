import { useNavigate } from "react-router";

import { register as registerUser } from "@/api/auth/auth.api";
import { AuthLayout } from "@/layouts/auth.layout";
import { savePendingRegistration } from "@/utils/registration/pending-registration";

import { RegisterForm } from "./components/RegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  async function handleRegister(values) {
    const data = await registerUser(values);

    savePendingRegistration({
      email: data.email,
      expiresAt: data.expiresAt,
      resendAvailableAt: data.resendAvailableAt,
    });

    navigate("/verify-email", {
      replace: true,
    });
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Register as a motorcycle shop member."
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkTo="/login"
    >
      <RegisterForm onRegister={handleRegister} />
    </AuthLayout>
  );
}
