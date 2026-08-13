// const EMAIL_KEY = "pendingVerificationEmail";

// const EXPIRES_KEY = "pendingVerificationExpiresAt";

// export function savePendingEmail({ email, expiresAt }) {
//   sessionStorage.setItem(EMAIL_KEY, email);
//   sessionStorage.setItem(EXPIRES_KEY, expiresAt);
// }

// export function getPendingEmail() {
//   return sessionStorage.getItem(EMAIL_KEY);
// }
// export function getPendingExpiresAt() {
//   return sessionStorage.getItem(EXPIRES_KEY);
// }

// export function clearPendingEmail() {
//   sessionStorage.removeItem(EMAIL_KEY);
//   sessionStorage.removeItem(EXPIRES_KEY);
// }
const PENDING_REGISTRATION_KEY = "pendingRegistration";

export function savePendingRegistration(data) {
  sessionStorage.setItem(
    PENDING_REGISTRATION_KEY,
    JSON.stringify({
      email: data.email,
      expiresAt: data.expiresAt,
      resendAvailableAt: data.resendAvailableAt,
    }),
  );
}

export function getPendingRegistration() {
  const value = sessionStorage.getItem(PENDING_REGISTRATION_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function clearPendingRegistration() {
  sessionStorage.removeItem(PENDING_REGISTRATION_KEY);
}
