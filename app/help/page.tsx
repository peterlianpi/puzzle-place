import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Link href="/">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>
      <p className="text-lg text-muted-foreground">
        Find answers to common questions and get support for Puzzle Place.
      </p>
      {/* Add help content here */}
    </div>
  );
}
