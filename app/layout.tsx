import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth System",
  description: "Auth System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
