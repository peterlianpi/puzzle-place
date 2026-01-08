import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  backHref?: string;
  backText?: string;
}

export default function ErrorMessage({
  title = "An error occurred",
  message = "Please try again later",
  showBackButton = false,
  backHref = "/",
  backText = "Go Back"
}: ErrorMessageProps) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <p className="text-red-600 text-lg font-semibold">{title}</p>
        <p className="text-gray-600">{message}</p>
        {showBackButton && (
          <Link href={backHref}>
            <Button>{backText}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}