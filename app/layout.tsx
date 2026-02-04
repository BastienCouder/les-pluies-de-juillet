import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Auth System",
  description: "Auth System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="fr">
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <Navbar user={session?.user} />
        <main className="flex-1 flex flex-col bg-primary">
          {children}
        </main>
      </body>
    </html>
  );
}