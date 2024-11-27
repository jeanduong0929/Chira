import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "jotai";

import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

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
          <Provider>
            <main>{children}</main>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
