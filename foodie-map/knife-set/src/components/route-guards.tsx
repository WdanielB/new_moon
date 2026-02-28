"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground">Validando sesión...</div>;
  }

  return <>{children}</>;
}

export function RequireRole({
  role,
  children,
}: {
  role: "mark" | "super_user";
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!profile) {
      router.replace("/entrar-score");
      return;
    }

    if (role === "mark" && profile.role !== "mark" && profile.role !== "super_user") {
      router.replace("/quiero-ser-mark");
      return;
    }

    if (role === "super_user" && profile.role !== "super_user") {
      router.replace("/entrar-score");
    }
  }, [loading, user, profile, role, router]);

  if (loading || !user || !profile) {
    return <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground">Validando permisos...</div>;
  }

  const hasRole =
    role === "mark"
      ? profile.role === "mark" || profile.role === "super_user"
      : profile.role === "super_user";

  if (!hasRole) {
    return null;
  }

  return <>{children}</>;
}
