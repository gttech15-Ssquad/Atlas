"use client";

import {
  QueryClient,
  QueryClientProvider as QCProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (cache time)
    },
  },
});

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return <QCProvider client={queryClient}>{children}</QCProvider>;
}
