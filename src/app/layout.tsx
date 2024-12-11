import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "jotai";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/providers/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider>
          <ThemeProvider
            attribute={"class"}
            defaultTheme={"system"}
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClerkProvider>
              <main>{children}</main>
              <Toaster duration={2000} />
            </ConvexClerkProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
