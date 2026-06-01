"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save } from "lucide-react";

interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
}

export default function HeroSettingsPage() {
  const router = useRouter();
  const [hero, setHero] = useState<HeroContent>({
    title: "",
    subtitle: "",
    cta: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("hero_content")
      .single()
      .then(({ data }) => {
        if (data?.hero_content) setHero(data.hero_content as HeroContent);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);
    const supabase = createClient();
    const { error } = await supabase
      .from("settings")
      .update({ hero_content: hero })
      .eq("id", 1);
    if (error) setError(error.message);
    else setSuccess(true);
    setSaving(false);
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all";
  const inputStyle = {
    backgroundColor: "var(--background)",
    borderColor: "var(--border)",
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Form */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        {error && (
          <div
            className="px-4 py-3 rounded-lg text-sm border"
            style={{
              backgroundColor: "oklch(95% 0.05 27)",
              borderColor: "oklch(80% 0.1 27)",
              color: "oklch(40% 0.15 27)",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="px-4 py-3 rounded-lg text-sm border"
            style={{
              backgroundColor: "oklch(95% 0.05 150)",
              borderColor: "oklch(80% 0.1 150)",
              color: "oklch(40% 0.15 150)",
            }}
          >
            Hero section saved successfully.
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Headline
          </label>
          <input
            type="text"
            value={hero.title}
            onChange={(e) => setHero((h) => ({ ...h, title: e.target.value }))}
            placeholder="Building production-ready web apps"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Subheadline
          </label>
          <textarea
            value={hero.subtitle}
            onChange={(e) =>
              setHero((h) => ({ ...h, subtitle: e.target.value }))
            }
            rows={3}
            placeholder="Full-stack developer specializing in..."
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            CTA Button Label
          </label>
          <input
            type="text"
            value={hero.cta}
            onChange={(e) => setHero((h) => ({ ...h, cta: e.target.value }))}
            placeholder="Hire Me"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-500 border transition-all hover:-translate-y-0.5"
          style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Hero"}
        </button>
      </div>
    </div>
  );
}
