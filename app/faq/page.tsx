import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Link href="/">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <p className="text-lg text-muted-foreground">
        Answers to common questions about Puzzle Place.
      </p>
      {/* Add FAQ content here */}
    </div>
  );
}