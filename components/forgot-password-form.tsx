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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForgotPassword } from "@/features/auth/api/use-forgot-password";

const formSchema = z.object({
  email: z.email("Invalid email address"),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      // Success toast is handled by the useForgotPassword hook
      // On success, stay on page or redirect to login
      // router.push("/login");
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Forgot password error:", error);
    }
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
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
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
        <Button type="submit" disabled={forgotPasswordMutation.isPending}>
          {forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
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
