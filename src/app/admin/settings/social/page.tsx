"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

export default function SocialSettingsPage() {
  const router = useRouter();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "github", url: "" },
    { platform: "linkedin", url: "" },
    { platform: "email", url: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("social_links")
      .single()
      .then(({ data }) => {
        if (
          data?.social_links &&
          (data.social_links as SocialLink[]).length > 0
        )
          setSocialLinks(data.social_links as SocialLink[]);
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
      .update({ social_links: socialLinks })
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

      {/* Feedback */}
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
          Social links saved successfully.
        </div>
      )}

      {/* Form */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-blue-500">Social Links</h2>

        <div className="space-y-3">
          {socialLinks.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => {
                  const updated = [...socialLinks];
                  updated[i] = { ...updated[i], platform: e.target.value };
                  setSocialLinks(updated);
                }}
                placeholder="Platform (e.g. github)"
                className={inputClass}
                style={{ ...inputStyle, maxWidth: "160px" }}
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  const updated = [...socialLinks];
                  updated[i] = { ...updated[i], url: e.target.value };
                  setSocialLinks(updated);
                }}
                placeholder="https://..."
                className={inputClass}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() =>
                  setSocialLinks((s) => s.filter((_, j) => j !== i))
                }
                className="px-2 rounded-lg text-xs border-2 text-muted-foreground font-bold hover:text-foreground transition-colors shrink-0"
                style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setSocialLinks((s) => [...s, { platform: "", url: "" }])
          }
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
        >
          + Add social link
        </button>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-500 border transition-all hover:-translate-y-0.5"
        style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Social Links"}
      </button>
    </div>
  );
}
