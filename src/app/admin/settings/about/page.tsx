"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save } from "lucide-react";

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

export default function AboutSettingsPage() {
  const router = useRouter();
  const [about, setAbout] = useState<AboutContent>({
    name: "",
    role: "",
    location: "",
    available: true,
    bio: [""],
    timeline: [{ year: "", title: "", company: "" }],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("about_content")
      .single()
      .then(({ data }) => {
        if (data?.about_content) {
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
      .update({ about_content: about })
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
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">About Section</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit your bio, timeline, name, role and location.
          </p>
        </div>
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
          About section saved successfully.
        </div>
      )}

      {/* Basic Info */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-foreground">Basic Info</h2>

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
              Availability
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
      </div>

      {/* Bio */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-foreground">Bio Paragraphs</h2>

        <div className="space-y-2">
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
      </div>

      {/* Timeline */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-foreground">Career Timeline</h2>

        <div className="space-y-2">
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
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 hover:-translate-y-0.5"
        style={{ background: "oklch(60% 0.18 232)" }}
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save About"}
      </button>
    </div>
  );
}
