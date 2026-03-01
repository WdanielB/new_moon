import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 text-center md:px-6">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">La ruta que buscas no existe o cambió.</p>
      <Link href="/" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Volver al inicio
      </Link>
    </main>
  );
}
