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
import { Field, FieldDescription, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { GoogleSignInButton } from "@/features/auth/components/google-signin-button";
import { useState, useEffect } from "react";
import Link from "next/link";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(() => {
    // Initialize from URL parameter
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("message");
    }
    return null;
  });
  const [redirectUrl] = useState<string | null>(() => {
    // Initialize redirect from URL parameter
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("redirect");
    }
    return null;
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Clear the URL parameter after component mounts
    if (successMessage) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("message");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [successMessage]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Prevent redirecting to auth pages after login
    const safeRedirectUrl = redirectUrl
      // && !redirectUrl.startsWith("/auth/") 
      ? redirectUrl : "/dashboard";
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: safeRedirectUrl,
      },
      {
        onRequest: () => {
          setIsLoading(true);
          setError(null);
        },
        onResponse: () => {
          setIsLoading(false);
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Login failed. Please try again.");
        },
        onSuccess: () => {
          // Manually handle redirect since callbackURL might not work as expected
          window.location.href = safeRedirectUrl;
        },
      }
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
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        {successMessage && (
          <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center">
          <Link
            href="/auth/forgot-password"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <GoogleSignInButton
            loading={googleLoading}
            setLoading={setGoogleLoading}
            setError={setError}
            errorMessage="Google login failed. Please try again."
            redirectTo={redirectUrl || undefined}
          >
            Login with Google
          </GoogleSignInButton>
          <FieldDescription className="px-6 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href={`/auth/signup${redirectUrl
                  ? `?redirect=${encodeURIComponent(redirectUrl)}`
                  : ""
                }`}
              className="underline underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </form>
    </Form>
  );
}
