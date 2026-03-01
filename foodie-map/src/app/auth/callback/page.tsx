"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Ensure profile exists for OAuth users
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("profiles").upsert({
            id: session.user.id,
            email: session.user.email ?? "",
            full_name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? null,
            role: "user",
          });
        }
      }

      router.replace("/entrar-score");
    };

    void run();
  }, [router]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Finalizando autenticación...</p>
      </div>
    </main>
  );
}
