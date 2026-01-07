"use client";

import { useState } from "react";
import { Control, FieldPath, FieldValues, UseFormWatch } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ConfirmPasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  watch: UseFormWatch<T>;
  passwordToMatch: string;
  placeholder?: string;
}

export function ConfirmPasswordField<T extends FieldValues>({
  control,
  name,
  label,
  watch,
  passwordToMatch,
  placeholder = "••••••••",
}: ConfirmPasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                id={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                {...field}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormControl>
          {field.value && (
            <p
              className={cn(
                "text-sm",
                passwordToMatch === field.value
                  ? "text-green-600"
                  : "text-red-500"
              )}
            >
              {passwordToMatch === field.value
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
