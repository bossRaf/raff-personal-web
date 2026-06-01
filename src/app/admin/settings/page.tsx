"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChevronRight, Sparkles, User, Share2, Save } from "lucide-react";

const sections = [
  {
    href: "/admin/settings/hero",
    icon: Sparkles,
    label: "Hero Section",
    description: "Edit headline, subheadline and CTA button label.",
  },
  {
    href: "/admin/settings/about",
    icon: User,
    label: "About Section",
    description: "Edit bio, career timeline, name, role and location.",
  },
  {
    href: "/admin/settings/social",
    icon: Share2,
    label: "Social Links",
    description: "Edit GitHub, LinkedIn, email and other social links.",
  },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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

  async function saveTheme() {
    setSaving(true);
    setSuccess(false);
    const supabase = createClient();
    await supabase
      .from("settings")
      .update({ default_theme: theme })
      .eq("id", 1);
    setSaving(false);
    setSuccess(true);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Default theme */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h6 className="font-bold font-sm text-foreground">
          Set the default theme for your public portfolio
        </h6>

        <div className="flex gap-3">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-blue-500 border transition-all capitalize"
              style={{
                backgroundColor:
                  theme === t ? "oklch(60% 0.18 232 / 0.15)" : "transparent",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {success && (
          <p className="text-sm" style={{ color: "oklch(55% 0.18 150)" }}>
            Theme saved successfully.
          </p>
        )}

        <button
          onClick={saveTheme}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-500 border transition-all hover:-translate-y-0.5"
          style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Theme"}
        </button>
      </div>

      {/* Section links */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-foreground">Content Sections</h2>
        </div>
        <div className="divide-y">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.href}
                onClick={() => router.push(section.href)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-accent/30 transition-colors text-left"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: "oklch(60% 0.18 232)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {section.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
