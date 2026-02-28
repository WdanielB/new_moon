"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const publicLinks = [
  { href: "/", label: "Explorar" },
  { href: "/algoritmo", label: "Algoritmo" },
  { href: "/metodologia", label: "Metodología" },
  { href: "/faq", label: "FAQ" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, user, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAppPage = pathname.startsWith("/app") || pathname.startsWith("/admin");

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-black text-primary">
              KS
            </span>
            <span className="text-sm font-semibold tracking-tight">Knife Set</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {publicLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-2.5 py-1.5 text-[13px] transition ${
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {!loading && user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/app/usuarios"
                  className={`rounded-md px-2.5 py-1.5 text-[13px] transition ${
                    pathname.startsWith("/app")
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Mi KS
                </Link>
                {profile?.role === "super_user" && (
                  <Link
                    href="/admin/super-user"
                    className={`rounded-md px-2.5 py-1.5 text-[13px] transition ${
                      pathname.startsWith("/admin")
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[13px] text-muted-foreground transition hover:border-primary/20 hover:text-foreground"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                    {(profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase()}
                  </span>
                  Salir
                </button>
              </div>
            ) : !loading ? (
              <div className="hidden gap-2 md:flex">
                <Link
                  href="/login"
                  className="rounded-md border border-border px-3 py-1.5 text-[13px] transition hover:border-primary/30"
                >
                  Entrar
                </Link>
                <Link
                  href="/registro"
                  className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Crear cuenta
                </Link>
              </div>
            ) : null}

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-1.5 text-muted-foreground md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="border-t border-border bg-card px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {publicLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm transition ${
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="my-1 h-px bg-border" />
              {!loading && user ? (
                <>
                  <Link href="/app/usuarios" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                    Mi KS
                  </Link>
                  {(profile?.role === "mark" || profile?.role === "super_user") && (
                    <Link href="/app/mark" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                      Vista MARK
                    </Link>
                  )}
                  {profile?.role === "super_user" && (
                    <Link href="/admin/super-user" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => { void signOut(); setMobileOpen(false); }}
                    className="rounded-md px-3 py-2 text-left text-sm text-muted-foreground"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : !loading ? (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                    Entrar
                  </Link>
                  <Link href="/registro" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-primary">
                    Crear cuenta
                  </Link>
                </>
              ) : null}
            </div>
          </nav>
        )}
      </header>

      {children}

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Knife Set</span>
            <span>·</span>
            <span>Calificaciones gastronómicas transparentes</span>
          </div>
          <div className="flex gap-3">
            <Link href="/sobre" className="transition hover:text-foreground">Sobre</Link>
            <Link href="/faq" className="transition hover:text-foreground">FAQ</Link>
            <Link href="/metodologia" className="transition hover:text-foreground">Metodología</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
