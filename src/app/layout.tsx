import type { Metadata } from "next";
import "@fontsource-variable/vend-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joind — Couples Finance",
  description: "Manage money together. Track spending, share budgets, and pay off debt as a couple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
