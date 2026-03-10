import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knife Set | Edicion de la Noche",
  description: "Agenda cultural, points y criterio editorial en una portada de periodico antiguo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
