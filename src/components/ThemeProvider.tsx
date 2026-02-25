"use client";

import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { primaryColor, fetchConfigs } = useThemeStore();

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  return (
    <div style={{ "--primary": primaryColor } as React.CSSProperties} className="min-h-screen">
      {children}
    </div>
  );
}