import "./globals.css";
import { Cormorant_Garamond, Jost } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

export const metadata = {
  title: "A Farewell Keepsake | Sheikh Mehvish Qadir",
  description: "A private farewell keepsake and golden memory frame.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
