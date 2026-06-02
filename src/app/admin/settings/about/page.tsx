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
  profileImage: string;
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
    profileImage: "",
    bio: [""],
    timeline: [{ year: "", title: "", company: "" }],
  });
  const [loading, setLoading] = useState(true);
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [savingTimeline, setSavingTimeline] = useState(false);
  const [successBasic, setSuccessBasic] = useState(false);
  const [successBio, setSuccessBio] = useState(false);
  const [successTimeline, setSuccessTimeline] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  async function getCurrentAbout() {
    const supabase = createClient();
    const { data } = await supabase
      .from("settings")
      .select("about_content")
      .single();
    return (data?.about_content as AboutContent) || about;
  }

  async function uploadProfileImage(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    const supabase = createClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `profile-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploadingImage(false);
      return;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    setAbout((prev) => ({
      ...prev,
      profileImage: data.publicUrl,
    }));

    setUploadingImage(false);
  }

  async function saveBasic() {
    setSavingBasic(true);
    setError("");
    setSuccessBasic(false);
    const current = await getCurrentAbout();
    const supabase = createClient();
    const { error } = await supabase
      .from("settings")
      .update({
        about_content: {
          ...current,
          name: about.name,
          role: about.role,
          location: about.location,
          available: about.available,
          profileImage: about.profileImage,
        },
      })
      .eq("id", 1);
    if (error) setError(error.message);
    else setSuccessBasic(true);
    setSavingBasic(false);
  }

  async function saveBio() {
    setSavingBio(true);
    setError("");
    setSuccessBio(false);
    const current = await getCurrentAbout();
    const supabase = createClient();
    const { error } = await supabase
      .from("settings")
      .update({ about_content: { ...current, bio: about.bio } })
      .eq("id", 1);
    if (error) setError(error.message);
    else setSuccessBio(true);
    setSavingBio(false);
  }

  async function saveTimeline() {
    setSavingTimeline(true);
    setError("");
    setSuccessTimeline(false);
    const current = await getCurrentAbout();
    const supabase = createClient();
    const { error } = await supabase
      .from("settings")
      .update({ about_content: { ...current, timeline: about.timeline } })
      .eq("id", 1);
    if (error) setError(error.message);
    else setSuccessTimeline(true);
    setSavingTimeline(false);
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all";
  const inputStyle = {
    backgroundColor: "var(--background)",
    borderColor: "var(--border)",
  };

  const saveButtonClass =
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-500 border transition-all hover:-translate-y-0.5";
  const saveButtonStyle = { background: "oklch(60% 0.18 232 / 0.15)" };

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
          style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Error */}
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

      {/* Basic Info */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-blue-500">Basic Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              type="text"
              value={about.name ?? ""}
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
              value={about.role ?? ""}
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
              value={about.location ?? ""}
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

          <div className="space-y-2 sm:col-span-2">
            <input
              type="file"
              accept="image/*"
              onChange={uploadProfileImage}
              className={inputClass}
              style={inputStyle}
            />

            {uploadingImage && (
              <p className="text-sm text-muted-foreground">
                Uploading image...
              </p>
            )}

            {about.profileImage && (
              <img
                src={about.profileImage}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-xl border"
              />
            )}
          </div>
        </div>

        {successBasic && (
          <p className="text-sm" style={{ color: "oklch(55% 0.18 150)" }}>
            Basic info saved successfully.
          </p>
        )}

        <button
          onClick={saveBasic}
          disabled={savingBasic}
          className={saveButtonClass}
          style={saveButtonStyle}
        >
          <Save className="h-4 w-4" />
          {savingBasic ? "Saving..." : "Save Basic Info"}
        </button>
      </div>

      {/* Bio */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-blue-500">Bio Paragraphs</h2>

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
                className="px-2 rounded-lg text-xs border-2 text-muted-foreground font-bold hover:text-foreground transition-colors shrink-0"
                style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
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

        {successBio && (
          <p className="text-sm" style={{ color: "oklch(55% 0.18 150)" }}>
            Bio saved successfully.
          </p>
        )}

        <button
          onClick={saveBio}
          disabled={savingBio}
          className={saveButtonClass}
          style={saveButtonStyle}
        >
          <Save className="h-4 w-4" />
          {savingBio ? "Saving..." : "Save Bio"}
        </button>
      </div>

      {/* Timeline */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-blue-500">Career Timeline</h2>

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
                  className="px-2 rounded-lg text-xs border-2 text-muted-foreground font-bold hover:text-foreground transition-colors shrink-0"
                  style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
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

        {successTimeline && (
          <p className="text-sm" style={{ color: "oklch(55% 0.18 150)" }}>
            Timeline saved successfully.
          </p>
        )}

        <button
          onClick={saveTimeline}
          disabled={savingTimeline}
          className={saveButtonClass}
          style={saveButtonStyle}
        >
          <Save className="h-4 w-4" />
          {savingTimeline ? "Saving..." : "Save Timeline"}
        </button>
      </div>
    </div>
  );
}
