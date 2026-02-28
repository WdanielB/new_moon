"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      await supabase.auth.getSession();
      router.replace("/entrar-score");
    };

    void run();
  }, [router]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground md:px-6">
      Finalizando autenticación...
    </main>
  );
}
