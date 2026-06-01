"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("default_theme")
      .single()
      .then(({ data }) => {
        if (data?.default_theme) setTheme(data.default_theme);
      });
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8 md:pt-8 pt-20">
        {children}
      </main>
    </div>
  );
}
