"use client";

import { Control, FieldPath, FieldValues, UseFormWatch, useWatch } from "react-hook-form";
import { PasswordField } from "./password-field";
import { ConfirmPasswordField } from "./confirm-password-field";
  
interface PasswordWithConfirmationProps<T extends FieldValues> {
  control: Control<T>;
  passwordName: FieldPath<T>;
  confirmPasswordName: FieldPath<T>;
  watch: UseFormWatch<T>;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  oldPassword?: string;
  userName?: string;
  userEmail?: string;
  passwordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
}

export function PasswordWithConfirmation<T extends FieldValues>({
  control,
  passwordName,
  confirmPasswordName,
  watch,
  passwordLabel = "Password",
  confirmPasswordLabel = "Confirm Password",
  oldPassword,
  userName,
  userEmail,
  passwordPlaceholder,
  confirmPasswordPlaceholder,
}: PasswordWithConfirmationProps<T>) {
  const passwordValue = useWatch({
    control,
    name: passwordName,
  });

  return (
    <>
      <PasswordField
        control={control}
        name={passwordName}
        label={passwordLabel}
        watch={watch}
        oldPassword={oldPassword}
        userName={userName}
        userEmail={userEmail}
        placeholder={passwordPlaceholder}
      />
      <ConfirmPasswordField
        control={control}
        name={confirmPasswordName}
        label={confirmPasswordLabel}
        watch={watch}
        passwordToMatch={passwordValue}
        placeholder={confirmPasswordPlaceholder}
      />
    </>
  );
}