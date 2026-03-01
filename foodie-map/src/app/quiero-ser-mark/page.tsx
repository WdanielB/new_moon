"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createMarkRequest } from "@/lib/ks-api";
import { useAuth } from "@/providers/auth-provider";

export default function MarkRequestPage() {
  const { user, profile } = useAuth();
  const [bio, setBio] = useState("Tengo criterio gastronómico técnico y enfoque imparcial.");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await createMarkRequest(bio);
      setMessage("Solicitud MARK enviada. Un super_user revisará tu perfil.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar solicitud");
    }
  };

  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8 md:px-6">
        <section className="rounded-xl border border-border bg-card p-5 text-sm">
          <h1 className="text-2xl font-semibold">Quiero ser MARK</h1>
          <p className="mt-2 text-muted-foreground">Necesitas iniciar sesión para enviar tu solicitud.</p>
          <Link href="/login" className="mt-3 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Ir a Login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8 md:px-6">
      <section className="space-y-3 rounded-xl border border-border bg-card p-5">
        <h1 className="text-2xl font-semibold">Solicitud de rol MARK</h1>
        <p className="text-sm text-muted-foreground">Rol actual: {profile?.role ?? "user"}</p>
        <form onSubmit={onSubmit} className="space-y-2">
          <textarea className="h-28 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={bio} onChange={(event) => setBio(event.target.value)} />
          <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" type="submit">
            Enviar solicitud
          </button>
        </form>
        {message ? <p className="text-xs text-primary">{message}</p> : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </section>
    </main>
  );
}
