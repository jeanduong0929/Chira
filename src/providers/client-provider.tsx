import React from "react";

import { ClerkProvider } from "@clerk/nextjs";

interface ClerkClientProviderProps {
  children: React.ReactNode;
}

export const ClerkClientProvider = ({ children }: ClerkClientProviderProps) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};
