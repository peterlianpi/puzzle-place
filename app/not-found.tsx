"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col p-4 items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you are looking for does not exist.
        </p>
        <div className="flex gap-4 flex-col justify-center">
          <div>
            <Button
              className="w-full"
              onClick={() => window.history.back()}
              variant="outline"
            >
              Go Back
            </Button>
          </div>
          <Link href="/">
            <Button className="w-full">Back to Home</Button>
          </Link>
          <div>
            <Button
              className="w-full"
              onClick={handleRefresh}
              variant="outline"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
