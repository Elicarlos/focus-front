import { Outfit } from "next/font/google";
import Script from "next/script";
import ThemeWrapper from "@/components/ThemeWrapper";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["300", "400", "600", "800", "900"],
});

export const metadata = {
  title: "Grove | Foco & Crescimento",
  description: "Timer Pomodoro com mascote que cresce com você. Anti-procrastinação baseado em ciência.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={outfit.className}>
        <ThemeWrapper>{children}</ThemeWrapper>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}
