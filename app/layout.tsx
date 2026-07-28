import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "material-symbols/rounded.css";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Eiviplant · Partes de trabajo",
  description: "Mock navegable para la gestión moderna de partes de Eiviplant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
