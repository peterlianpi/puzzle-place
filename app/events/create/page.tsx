"use client";

import { lazy, Suspense } from "react";
import { redirect } from "next/navigation";
import { useAuthStatus } from "@/features/auth/api/use-auth-status";
import { Navbar } from "@/components/Navbar";

const CreateEventForm = lazy(
  () => import("@/features/my-events/components/CreateEventForm")
);

export default function CreateEventPage() {
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/auth/login?next=/events/create");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Create New Event
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Set up your prize event with custom prizes and values
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }
          >
            <CreateEventForm mode="create" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
