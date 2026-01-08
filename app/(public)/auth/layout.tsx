export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen p-4">
      {children}
    </div>
  );
}