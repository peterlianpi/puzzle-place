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
import { Checkbox } from "@/components/ui/checkbox";

import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth/auth-client";
import { GoogleSignInButton } from "@/components/google-signin-button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Check, X, Loader2 } from "lucide-react";
import { PasswordWithConfirmation } from "@/features/auth/components/password-with-confirmation";

const commonPasswords = [
  "password",
  "123456",
  "123456789",
  "qwerty",
  "abc123",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
];

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => !commonPasswords.includes(data.password.toLowerCase()), {
    message: "Password is too common, please choose a stronger one",
    path: ["password"],
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
  }>({ checking: false, available: null });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const watchedUsername = useWatch({
    control: form.control,
    name: "username",
  });

  useEffect(() => {
    if (!watchedUsername || watchedUsername.length < 3) {
      setUsernameStatus({ checking: false, available: null });
      return;
    }

    setUsernameStatus({ checking: true, available: null });

    const checkUsername = async () => {
      try {
        const response = await fetch("/api/auth/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: watchedUsername }),
        });

        if (response.ok) {
          const { available } = await response.json();
          setUsernameStatus({ checking: false, available });
        } else {
          setUsernameStatus({ checking: false, available: null });
        }
      } catch (error) {
        console.error("Username check error:", error);
        setUsernameStatus({ checking: false, available: null });
      }
    };

    const timeoutId = setTimeout(checkUsername, 500); // Debounce 500ms
    return () => clearTimeout(timeoutId);
  }, [watchedUsername]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Check username availability
    try {
      const checkResponse = await fetch("/api/auth/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.username }),
      });

      if (!checkResponse.ok) {
        const error = await checkResponse.json();
        toast.error(error.error || "Username check failed");
        return;
      }

      const { available } = await checkResponse.json();
      if (!available) {
        toast.error("Username is already taken");
        return;
      }
    } catch (error) {
      console.error("Username check error:", error);
      toast.error("Failed to check username availability");
      return;
    }

    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
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
          setError(ctx.error.message || "Signup failed. Please try again.");
        },
        onSuccess: async () => {
          // Set the username in the database
          try {
            const response = await fetch("/api/auth/set-username", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username: data.username }),
            });

            if (!response.ok) {
              const error = await response.json();
              toast.error(error.error || "Failed to set username");
              return;
            }

            toast.success("Account created successfully!");
            router.push("/auth/profile");
          } catch (error) {
            console.error("Set username error:", error);
            toast.error("Account created but username setup failed");
            router.push("/auth/profile");
          }
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe123" {...field} />
              </FormControl>
              {watchedUsername && watchedUsername.length >= 3 && (
                <div className="flex items-center gap-2 text-sm">
                  {usernameStatus.checking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Checking availability...</span>
                    </>
                  ) : usernameStatus.available === true ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Username is available</span>
                    </>
                  ) : usernameStatus.available === false ? (
                    <>
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">Username is taken</span>
                    </>
                  ) : null}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <PasswordWithConfirmation
          control={form.control}
          passwordName="password"
          confirmPasswordName="confirmPassword"
          watch={form.watch}
          passwordLabel="Password"
          confirmPasswordLabel="Confirm Password"
          userName={form.watch("name")}
          userEmail={form.watch("email")}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <GoogleSignInButton
            loading={googleLoading}
            setLoading={setGoogleLoading}
            setError={setError}
            errorMessage="Google signup failed. Please try again."
          >
            Sign up with Google
          </GoogleSignInButton>
          <FieldDescription className="px-4 text-center">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </form>
    </Form>
  );
}
