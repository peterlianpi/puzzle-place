import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/signup"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to signup
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using this service, you accept and agree to be bound by the terms
          and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily access the materials on this service for personal,
          non-commercial transitory viewing only.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate,
          complete, and current at all times.
        </p>

        <h2>4. Password Security</h2>
        <p>
          You are responsible for safeguarding the password that you use to access the service
          and for any activities or actions under your password.
        </p>

        <h2>5. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us.
        </p>
      </div>

      <div className="mt-8 pt-8 border-t">
        <Link
          href="/signup"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to signup
        </Link>
      </div>
    </div>
  );
}