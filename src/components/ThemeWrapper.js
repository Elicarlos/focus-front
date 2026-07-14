"use client";

import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function ThemeApplier({ children }) {
  const { theme } = useTheme();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { background: ${theme.bg}; color: ${theme.text}; }
      `}} />
      {children}
    </>
  );
}

export default function ThemeWrapper({ children }) {
  return (
    <ThemeProvider>
      <ThemeApplier>{children}</ThemeApplier>
    </ThemeProvider>
  );
}
