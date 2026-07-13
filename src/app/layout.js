import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["300", "400", "600", "800", "900"],
});

export const metadata = {
  title: "Pragma | Central de Foco & Produtividade",
  description: "Gerencie suas metas, hábitos e timers com gamificação avançada de RPG e Alquimia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={outfit.className}>
        {children}
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}
