import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "jotai";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClerkProvider } from "@/providers/convex-clerk-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chira",
  description: "Project Management App",
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
          <Provider>
            <ConvexClerkProvider>{children}</ConvexClerkProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
