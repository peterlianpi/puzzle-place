"use client";

import { redirect } from "next/navigation";
import CreateEventForm from "@/features/my-events/components/CreateEventForm";
import { authClient } from "@/lib/auth/auth-client";

export default function CreateEventPage() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Game Event</h1>
      <CreateEventForm mode="create" />
    </div>
  );
}
