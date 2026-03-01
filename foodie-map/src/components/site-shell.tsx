"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  MapPin,
  LogOut,
  ChevronDown,
  Star,
  Shield,
  Compass,
  BookOpen,
  HelpCircle,
  Info,
} from "lucide-react";

const publicLinks = [
  { href: "/", label: "Explorar", icon: Compass },
  { href: "/algoritmo", label: "Algoritmo", icon: BookOpen },
  { href: "/metodologia", label: "Metodología", icon: Info },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

function KSLogo() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-ks-amber to-ks-emerald shadow-md">
      <span className="font-display text-sm font-black tracking-tight text-primary-foreground drop-shadow-sm">
        KS
      </span>
    </span>
  );
}

function UserDropdown() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initial = (profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase();
  const displayName = profile?.full_name ?? user.email ?? "Usuario";
  const roleBadge = profile?.role === "super_user" ? "Admin" : profile?.role === "mark" ? "MARK" : "Usuario";
  const roleBadgeColor =
    profile?.role === "super_user"
      ? "bg-ks-rose/20 text-ks-rose"
      : profile?.role === "mark"
        ? "bg-ks-amber/20 text-ks-amber"
        : "bg-primary/15 text-primary";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-2.5 py-1.5 transition hover:border-primary/30 hover:bg-card"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-ks-amber/80 text-xs font-bold text-primary-foreground shadow-sm">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate text-sm font-medium lg:block">{displayName}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-top-2">
          {/* User info header */}
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-ks-amber/80 text-sm font-bold text-primary-foreground shadow">
                {initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleBadgeColor}`}>
                {profile?.role === "super_user" && <Shield className="h-2.5 w-2.5" />}
                {profile?.role === "mark" && <Star className="h-2.5 w-2.5" />}
                {roleBadge}
              </span>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <button
              type="button"
              onClick={() => { router.push("/entrar-score"); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
            >
              <MapPin className="h-4 w-4" />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => { router.push("/app/usuarios"); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
            >
              <Compass className="h-4 w-4" />
              Mi KS
            </button>
            {(profile?.role === "mark" || profile?.role === "super_user") && (
              <button
                type="button"
                onClick={() => { router.push("/app/mark"); setOpen(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
              >
                <Star className="h-4 w-4" />
                Vista MARK
              </button>
            )}
            {profile?.role === "super_user" && (
              <button
                type="button"
                onClick={() => { router.push("/admin/super-user"); setOpen(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
              >
                <Shield className="h-4 w-4" />
                Panel Admin
              </button>
            )}
          </div>

          {/* Sign out */}
          <div className="border-t border-border py-1.5">
            <button
              type="button"
              onClick={() => { void signOut(); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ks-rose transition hover:bg-ks-rose/10"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, user, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <KSLogo />
            <div className="flex flex-col">
              <span className="font-display text-base font-bold leading-tight tracking-tight">Knife Set</span>
              <span className="hidden text-[10px] leading-none text-muted-foreground sm:block">Arequipa Food Score</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {publicLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-[13px] transition ${
                    active
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
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
              <div className="hidden md:flex">
                <UserDropdown />
              </div>
            ) : !loading ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/login"
                  className="rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
                >
                  Entrar
                </Link>
                <Link
                  href="/registro"
                  className="rounded-lg bg-gradient-to-r from-primary to-ks-amber px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-md transition hover:shadow-lg hover:brightness-110"
                >
                  Crear cuenta
                </Link>
              </div>
            ) : null}

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted/40 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="border-t border-border bg-card px-4 py-3 md:hidden animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-0.5">
              {publicLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}

              <div className="my-2 h-px bg-border" />

              {!loading && user ? (
                <>
                  {/* User info in mobile */}
                  <div className="mb-2 flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-ks-amber/80 text-xs font-bold text-primary-foreground">
                      {(profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{profile?.full_name ?? user.email}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{profile?.role ?? "user"}</p>
                    </div>
                  </div>

                  <Link href="/entrar-score" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/40">
                    <MapPin className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/app/usuarios" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/40">
                    <Compass className="h-4 w-4" /> Mi KS
                  </Link>
                  {(profile?.role === "mark" || profile?.role === "super_user") && (
                    <Link href="/app/mark" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/40">
                      <Star className="h-4 w-4" /> Vista MARK
                    </Link>
                  )}
                  {profile?.role === "super_user" && (
                    <Link href="/admin/super-user" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/40">
                      <Shield className="h-4 w-4" /> Admin
                    </Link>
                  )}

                  <div className="my-2 h-px bg-border" />
                  <button
                    type="button"
                    onClick={() => { void signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ks-rose hover:bg-ks-rose/10"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </button>
                </>
              ) : !loading ? (
                <div className="flex flex-col gap-2 pt-1">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary/30">
                    Entrar
                  </Link>
                  <Link href="/registro" onClick={() => setMobileOpen(false)} className="flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-ks-amber px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                    Crear cuenta
                  </Link>
                </div>
              ) : null}
            </div>
          </nav>
        )}
      </header>

      {children}

      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <KSLogo />
              <div>
                <span className="font-display text-sm font-bold tracking-tight">Knife Set</span>
                <p className="text-xs text-muted-foreground">Calificaciones gastronómicas transparentes</p>
              </div>
            </div>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <Link href="/sobre" className="transition hover:text-foreground">Sobre</Link>
              <Link href="/faq" className="transition hover:text-foreground">FAQ</Link>
              <Link href="/metodologia" className="transition hover:text-foreground">Metodología</Link>
              <Link href="/algoritmo" className="transition hover:text-foreground">Algoritmo</Link>
            </div>
            <p className="text-[10px] text-muted-foreground">© 2026 Knife Set · Arequipa, Perú</p>
          </div>
        </div>
      </footer>
    </>
  );
}
