"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { MapPin, Star, Shield } from "lucide-react";

export default function EnterScorePage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg space-y-4 px-4 py-10 md:px-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold">KS Score</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accede a las herramientas de evaluación de Knife Set
        </p>
      </div>

      {!user ? (
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Inicia sesión para explorar, calificar y participar en el sistema KS.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Entrar
            </Link>
            <Link
              href="/registro"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition hover:border-primary/30"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm">
              Sesión activa como{" "}
              <span className="font-semibold">{profile?.full_name ?? user.email}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Rol: <span className="font-medium text-primary">{profile?.role ?? "user"}</span>
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/app/usuarios"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/30 hover:bg-ks-surface-elevated"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ks-emerald/15">
                <MapPin className="h-4 w-4 text-ks-emerald" />
              </div>
              <div>
                <p className="text-sm font-semibold">Explorar</p>
                <p className="text-xs text-muted-foreground">Ver KS Points y ranking</p>
              </div>
            </Link>

            <Link
              href="/app/mark"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/30 hover:bg-ks-surface-elevated"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ks-amber/15">
                <Star className="h-4 w-4 text-ks-amber" />
              </div>
              <div>
                <p className="text-sm font-semibold">Vista MARK</p>
                <p className="text-xs text-muted-foreground">Calificar y evaluar</p>
              </div>
            </Link>

            {profile?.role === "super_user" && (
              <Link
                href="/admin/super-user"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/30 hover:bg-ks-surface-elevated sm:col-span-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ks-rose/15">
                  <Shield className="h-4 w-4 text-ks-rose" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Panel Admin</p>
                  <p className="text-xs text-muted-foreground">Gestionar solicitudes y moderación</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
