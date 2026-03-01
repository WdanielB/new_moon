import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knife Set | La Verdad Gastronómica",
  description: "Algoritmo de consistencia y score oficial para restaurantes y eventos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
