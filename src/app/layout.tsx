import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { Navbar } from "@/components/shared/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chira",
  description: "A project management tool for your team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div>
            <Navbar />
            <main>{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
