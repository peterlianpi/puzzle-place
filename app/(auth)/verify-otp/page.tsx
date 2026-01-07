"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GalleryVerticalEnd, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [attempts, setAttempts] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-submit when all 6 OTP fields are filled
  useEffect(() => {
    if (otp.length === 6 && step === "otp" && !isLoading && !hasAutoSubmitted) {
      setHasAutoSubmitted(true);
      formRef.current?.requestSubmit();
    }
  }, [otp, step, isLoading, hasAutoSubmitted]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!email) {
      setError("Email parameter is missing");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, attempts: attempts + 1 }),
      });

      const data = await response.json();

      if (!response.ok) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setError(
            "Account temporarily locked due to too many failed attempts. Please try again later."
          );
          setOtp("");
          setHasAutoSubmitted(false);
        } else {
          const errorMessage = data.error ||
            `Invalid OTP code. ${3 - newAttempts} attempts remaining.`;
          setError(errorMessage);
          if (errorMessage.includes("expired") || errorMessage.includes("Invalid or expired")) {
            setOtp("");
          }
          setHasAutoSubmitted(false);
        }
      } else {
        // OTP verified, proceed to password reset
        setStep("password");
        setOtp("");
        setError(null);
        setHasAutoSubmitted(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        // Password reset successful
        router.push("/login?message=Password reset successful");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setHasAutoSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend OTP");
      } else {
        setError("OTP sent successfully");
      }
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-xs flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Puzzle Place
          </a>
          <div className="text-center">
            <p className="text-muted-foreground">
              Invalid request. Email parameter is missing.
            </p>
            <a href="/forgot-password" className="text-primary hover:underline">
              Go to Forgot Password
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Puzzle Place
        </a>

        {step === "otp" ? (
          <form ref={formRef} onSubmit={handleVerifyOTP}>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Enter verification code</CardTitle>
                <CardDescription>
                  We sent a 6-digit code to {email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-center">
                      {error}
                    </div>
                  )}

                  <Field>
                    <FieldLabel htmlFor="otp" className="sr-only">
                      Verification code
                    </FieldLabel>
                    <InputOTP
                      maxLength={6}
                      id="otp"
                      value={otp}
                      onChange={setOtp}
                      required
                    >
                      <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <FieldDescription className="text-center">
                      Enter the 6-digit code sent to your email.
                    </FieldDescription>
                  </Field>
                  <Button type="submit" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                  <FieldDescription className="text-center">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary hover:underline disabled:opacity-50 underline"
                    >
                      Resend
                    </button>
                  </FieldDescription>
                </FieldGroup>
              </CardContent>
            </Card>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Reset your password</CardTitle>
                <CardDescription>
                  Enter your new password below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-center">
                      {error}
                    </div>
                  )}

                  <Field>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FieldDescription>
                      Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </Field>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </FieldGroup>
              </CardContent>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
