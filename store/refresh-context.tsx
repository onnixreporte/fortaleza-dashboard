"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

interface RefreshContextValue {
  registerRefresh: (fn: () => void) => void;
  unregisterRefresh: () => void;
  triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextValue>({
  registerRefresh: () => {},
  unregisterRefresh: () => {},
  triggerRefresh: () => {},
});

export function RefreshProvider({ children }: { children: ReactNode }) {
  const fnRef = useRef<(() => void) | null>(null);

  const registerRefresh = useCallback((fn: () => void) => {
    fnRef.current = fn;
  }, []);

  const unregisterRefresh = useCallback(() => {
    fnRef.current = null;
  }, []);

  const triggerRefresh = useCallback(() => {
    fnRef.current?.();
  }, []);

  return (
    <RefreshContext.Provider
      value={{ registerRefresh, unregisterRefresh, triggerRefresh }}
    >
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefreshContext() {
  return useContext(RefreshContext);
}
