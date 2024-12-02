import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "jotai";

import { ConvexClerkProvider } from "@/providers/convex-clerk-provider";

import "./globals.css";
import { Toaster } from "sonner";

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
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <ConvexClerkProvider>
            <main>{children}</main>
            <Toaster duration={2000} />
          </ConvexClerkProvider>
        </Provider>
      </body>
    </html>
  );
}
