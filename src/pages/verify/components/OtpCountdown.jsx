import { useEffect, useState } from "react";

export function OtpCountdown({ expiresAt, onExpired }) {
  function getRemainingSeconds() {
    const remaining = new Date(expiresAt).getTime() - Date.now();

    return Math.max(Math.ceil(remaining / 1000), 0);
  }

  const [seconds, setSeconds] = useState(getRemainingSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getRemainingSeconds();

      setSeconds(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        onExpired?.();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [expiresAt]);

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  return (
    <p className="text-sm text-muted-foreground">
      Code expires in {minutes}:{String(remainingSeconds).padStart(2, "0")}
    </p>
  );
}
