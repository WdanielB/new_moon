"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/entrar-score");
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-8 md:px-6">
      <section className="space-y-3 rounded-xl border border-border bg-card p-5">
        <h1 className="text-2xl font-semibold">Login</h1>
        <form onSubmit={onSubmit} className="space-y-2">
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" type="submit">Ingresar</button>
        </form>
        <button onClick={() => void signInWithGoogle()} className="w-full rounded-md border border-border px-4 py-2 text-sm font-semibold" type="button">
          Ingresar con Google
        </button>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <p className="text-xs text-muted-foreground">¿No tienes cuenta? <Link href="/registro" className="text-primary">Regístrate</Link></p>
      </section>
    </main>
  );
}
