"use client";

import { lazy, Suspense } from "react";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

const CreateEventForm = lazy(() => import("@/features/my-events/components/CreateEventForm"));

export default function CreateEventPage() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive text-lg">Authentication Error</p>
          <p className="text-muted-foreground">{error.message || "Please try logging in again"}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6 md:space-y-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Create New Game Event</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Set up your prize wheel event with custom prizes and values
          </p>
        </div>
      <Suspense fallback={
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <CreateEventForm mode="create" />
      </Suspense>
    </div>
  );
}
