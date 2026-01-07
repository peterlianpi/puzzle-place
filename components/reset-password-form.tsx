"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useResetPassword } from "@/features/auth/api/use-reset-password";

const formSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");
  const resetPasswordMutation = useResetPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (error === "INVALID_TOKEN") {
      form.setError("root", {
        message: "Invalid or expired reset token. Please request a new password reset.",
      });
    }
  }, [error, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!token) {
      form.setError("root", {
        message: "Invalid reset token. Please request a new password reset.",
      });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        newPassword: data.newPassword,
        token,
      });
      router.push("/login?message=password-reset-success");
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Reset password error:", error);
    }
  }

  if (!token && !error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
        <p className="text-muted-foreground text-sm">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm underline underline-offset-4 hover:underline"
        >
          Request a new password reset
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below.
          </p>
        </div>

        {form.formState.errors.root && (
          <div className="text-sm text-destructive text-center">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm underline underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  );
}