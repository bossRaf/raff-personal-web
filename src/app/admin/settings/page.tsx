"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save } from "lucide-react";

interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
}

interface TimelineItem {
  year: string;
  title: string;
  company: string;
}

interface AboutContent {
  name: string;
  role: string;
  location: string;
  available: boolean;
  bio: string[];
  timeline: TimelineItem[];
}

interface SocialLink {
  platform: string;
  url: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [hero, setHero] = useState<HeroContent>({
    title: "",
    subtitle: "",
    cta: "",
  });

  const [about, setAbout] = useState<AboutContent>({
    name: "",
    role: "",
    location: "",
    available: true,
    bio: [""],
    timeline: [{ year: "", title: "", company: "" }],
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "github", url: "" },
    { platform: "linkedin", url: "" },
    { platform: "email", url: "" },
  ]);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("settings")
      .select("hero_content, about_content, social_links")
      .single()
      .then(({ data }) => {
        if (data) {
          if (data.hero_content) setHero(data.hero_content as HeroContent);
          if (data.about_content) {
            const aboutData = data.about_content as AboutContent;
            setAbout({
              ...aboutData,
              bio: Array.isArray(aboutData.bio)
                ? aboutData.bio
                : [aboutData.bio || ""],
              timeline: Array.isArray(aboutData.timeline)
                ? aboutData.timeline
                : [],
            });
          }
          if (
            data.social_links &&
            (data.social_links as SocialLink[]).length > 0
          )
            setSocialLinks(data.social_links as SocialLink[]);
        }
        setLoading(false);
      });
  }, []);

  async function saveSection(section: "hero" | "about" | "social") {
    setSaving(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const updates: Record<string, unknown> = {};

    if (section === "hero") updates.hero_content = hero;
    if (section === "about") updates.about_content = about;
    if (section === "social") updates.social_links = socialLinks;

    const { error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", 1);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(`${section} settings saved successfully.`);
    }
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
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Manage your portfolio content and social links
        </h1>
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
          {success}
        </div>
      )}

      {/* Hero Content */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-foreground">Hero Section</h2>

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
            rows={2}
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
          onClick={() => saveSection("hero")}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 hover:-translate-y-0.5"
          style={{ background: "oklch(60% 0.18 232)" }}
        >
          <Save className="h-4 w-4" />
          Save Hero
        </button>
      </div>

      {/* About Content */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-foreground">About Section</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              type="text"
              value={about.name}
              onChange={(e) =>
                setAbout((a) => ({ ...a, name: e.target.value }))
              }
              placeholder="Your Name"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Role</label>
            <input
              type="text"
              value={about.role}
              onChange={(e) =>
                setAbout((a) => ({ ...a, role: e.target.value }))
              }
              placeholder="Full-Stack Developer"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Location
            </label>
            <input
              type="text"
              value={about.location}
              onChange={(e) =>
                setAbout((a) => ({ ...a, location: e.target.value }))
              }
              placeholder="Masbate, PH"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Available
            </label>
            <select
              value={about.available ? "true" : "false"}
              onChange={(e) =>
                setAbout((a) => ({
                  ...a,
                  available: e.target.value === "true",
                }))
              }
              className={inputClass}
              style={inputStyle}
            >
              <option value="true">Available for work</option>
              <option value="false">Not available</option>
            </select>
          </div>
        </div>

        {/* Bio paragraphs */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Bio Paragraphs
          </label>
          {about.bio.map((para, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={para}
                onChange={(e) => {
                  const updated = [...about.bio];
                  updated[i] = e.target.value;
                  setAbout((a) => ({ ...a, bio: updated }));
                }}
                rows={2}
                placeholder={`Paragraph ${i + 1}`}
                className={inputClass}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() =>
                  setAbout((a) => ({
                    ...a,
                    bio: a.bio.filter((_, j) => j !== i),
                  }))
                }
                className="px-2 py-1 rounded-lg text-xs border text-muted-foreground hover:text-foreground transition-colors shrink-0"
                style={{ borderColor: "var(--border)" }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setAbout((a) => ({ ...a, bio: [...a.bio, ""] }))}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            + Add paragraph
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Career Timeline
          </label>
          {about.timeline.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={item.year}
                onChange={(e) => {
                  const updated = [...about.timeline];
                  updated[i] = { ...updated[i], year: e.target.value };
                  setAbout((a) => ({ ...a, timeline: updated }));
                }}
                placeholder="Year"
                className={inputClass}
                style={inputStyle}
              />
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const updated = [...about.timeline];
                  updated[i] = { ...updated[i], title: e.target.value };
                  setAbout((a) => ({ ...a, timeline: updated }));
                }}
                placeholder="Title"
                className={inputClass}
                style={inputStyle}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) => {
                    const updated = [...about.timeline];
                    updated[i] = { ...updated[i], company: e.target.value };
                    setAbout((a) => ({ ...a, timeline: updated }));
                  }}
                  placeholder="Company"
                  className={inputClass}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() =>
                    setAbout((a) => ({
                      ...a,
                      timeline: a.timeline.filter((_, j) => j !== i),
                    }))
                  }
                  className="px-2 rounded-lg text-xs border text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setAbout((a) => ({
                ...a,
                timeline: [...a.timeline, { year: "", title: "", company: "" }],
              }))
            }
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            + Add timeline item
          </button>
        </div>

        <button
          onClick={() => saveSection("about")}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 hover:-translate-y-0.5"
          style={{ background: "oklch(60% 0.18 232)" }}
        >
          <Save className="h-4 w-4" />
          Save About
        </button>
      </div>

      {/* Social Links */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-foreground">Social Links</h2>

        {socialLinks.map((link, i) => (
          <div key={i} className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={link.platform}
              onChange={(e) => {
                const updated = [...socialLinks];
                updated[i] = { ...updated[i], platform: e.target.value };
                setSocialLinks(updated);
              }}
              placeholder="Platform"
              className={inputClass}
              style={inputStyle}
            />
            <div className="col-span-2 flex gap-2">
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
                className="px-2 rounded-lg text-xs border text-muted-foreground hover:text-foreground transition-colors shrink-0"
                style={{ borderColor: "var(--border)" }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setSocialLinks((s) => [...s, { platform: "", url: "" }])
          }
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
        >
          + Add social link
        </button>

        <button
          onClick={() => saveSection("social")}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 hover:-translate-y-0.5"
          style={{ background: "oklch(60% 0.18 232)" }}
        >
          {" "}
          <br />
          <Save className="h-4 w-4" />
          Save Social Links
        </button>
      </div>
    </div>
  );
}
