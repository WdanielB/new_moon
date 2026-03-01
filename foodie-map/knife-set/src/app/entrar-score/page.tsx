"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { MapPin, Star, Shield, Compass, TrendingUp, LogOut } from "lucide-react";

export default function EnterScorePage() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10 md:px-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-ks-amber to-ks-emerald shadow-lg">
          <span className="font-display text-lg font-black text-primary-foreground">KS</span>
        </div>
        <h1 className="font-display text-2xl font-bold md:text-3xl">KS Score Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu centro de control para explorar, evaluar y gestionar
        </p>
      </div>

      {!user ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
          <p className="mb-5 text-muted-foreground">
            Inicia sesión para acceder al sistema KS.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-gradient-to-r from-primary to-ks-amber px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-lg hover:brightness-110"
            >
              Entrar
            </Link>
            <Link
              href="/registro"
              className="rounded-xl border border-border px-6 py-3 text-sm font-medium transition hover:border-primary/30"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* User card */}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-ks-amber/80 text-lg font-bold text-primary-foreground shadow">
              {(profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold">{profile?.full_name ?? user.email}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                profile?.role === "super_user"
                  ? "bg-ks-rose/20 text-ks-rose"
                  : profile?.role === "mark"
                    ? "bg-ks-amber/20 text-ks-amber"
                    : "bg-primary/15 text-primary"
              }`}>
                {profile?.role === "super_user" && <Shield className="h-3 w-3" />}
                {profile?.role === "mark" && <Star className="h-3 w-3" />}
                {profile?.role === "super_user" ? "Admin" : profile?.role === "mark" ? "MARK" : "Usuario"}
              </span>
              <button
                type="button"
                onClick={() => void signOut()}
                className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-ks-rose"
              >
                <LogOut className="h-3 w-3" />
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Action cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/app/usuarios"
              className="card-glow flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ks-emerald/15">
                <Compass className="h-5 w-5 text-ks-emerald" />
              </div>
              <div>
                <p className="font-display text-base font-semibold">Explorar</p>
                <p className="text-xs text-muted-foreground">Ver KS Points y ranking</p>
              </div>
            </Link>

            <Link
              href="/app/mark"
              className="card-glow flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ks-amber/15">
                <Star className="h-5 w-5 text-ks-amber" />
              </div>
              <div>
                <p className="font-display text-base font-semibold">Vista MARK</p>
                <p className="text-xs text-muted-foreground">Calificar y evaluar</p>
              </div>
            </Link>

            <Link
              href="/"
              className="card-glow flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ks-cyan/15">
                <MapPin className="h-5 w-5 text-ks-cyan" />
              </div>
              <div>
                <p className="font-display text-base font-semibold">Mapa público</p>
                <p className="text-xs text-muted-foreground">Ver el explorador público</p>
              </div>
            </Link>

            {profile?.role === "super_user" && (
              <Link
                href="/admin/super-user"
                className="card-glow flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ks-rose/15">
                  <Shield className="h-5 w-5 text-ks-rose" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold">Panel Admin</p>
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
