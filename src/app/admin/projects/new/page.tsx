"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Upload } from "lucide-react";

interface Skill {
  id: number;
  name: string;
  category: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    excerpt: "",
    github_url: "",
    live_url: "",
    featured: false,
    published: false,
    display_order: 0,
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("skills")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setSkills(data as Skill[]);
      });
  }, []);

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleSkill = (id: number) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    let imageUrl = "";

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${form.slug}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(path, imageFile);
      if (uploadError) {
        setError("Image upload failed.");
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const { data: project, error: insertError } = await supabase
      .from("projects")
      .insert({ ...form, image: imageUrl || null })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    if (selectedSkills.length > 0) {
      await supabase.from("project_skills").insert(
        selectedSkills.map((skill_id) => ({
          project_id: project.id,
          skill_id,
        })),
      );
    }

    router.push("/admin/projects");
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all";
  const inputStyle = {
    backgroundColor: "var(--background)",
    borderColor: "var(--border)",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-10 text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Basic info */}
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2 className="font-semibold text-foreground">Basic Info</h2>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="My Awesome Project"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              required
              placeholder="my-awesome-project"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Excerpt
            </label>
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) =>
                setForm((f) => ({ ...f, excerpt: e.target.value }))
              }
              placeholder="Short description shown on project cards"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={4}
              placeholder="Full project description"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Links */}
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2 className="font-semibold text-foreground">Links</h2>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              GitHub URL
            </label>
            <input
              type="url"
              value={form.github_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, github_url: e.target.value }))
              }
              placeholder="https://github.com/username/repo"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Live URL
            </label>
            <input
              type="url"
              value={form.live_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, live_url: e.target.value }))
              }
              placeholder="https://myproject.com"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Image */}
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2 className="font-semibold text-foreground">Project Image</h2>

          <label
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors hover:border-opacity-80"
            style={{ borderColor: "oklch(74.6% 0.16 232.661)" }}
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Click to upload image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
          )}
        </div>

        {/* Skills */}
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2 className="font-semibold text-foreground">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
                className="px-3 py-1.5 rounded-full text-sm border transition-all"
                style={{
                  backgroundColor: selectedSkills.includes(skill.id)
                    ? "oklch(60% 0.18 232)"
                    : "transparent",
                  borderColor: selectedSkills.includes(skill.id)
                    ? "oklch(60% 0.18 232)"
                    : "var(--border)",
                  color: selectedSkills.includes(skill.id)
                    ? "white"
                    : "var(--muted-foreground)",
                }}
              >
                {skill.name}
              </button>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No skills yet. Add skills first.
              </p>
            )}
          </div>
        </div>

        {/* Settings */}
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2 className="font-semibold text-foreground">Settings</h2>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featured: e.target.checked }))
                }
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-foreground">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, published: e.target.checked }))
                }
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-foreground">Published</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Display Order
            </label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  display_order: parseInt(e.target.value),
                }))
              }
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* SEO */}
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2 className="font-semibold text-foreground">SEO</h2>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              SEO Title
            </label>
            <input
              type="text"
              value={form.seo_title}
              onChange={(e) =>
                setForm((f) => ({ ...f, seo_title: e.target.value }))
              }
              placeholder="Custom SEO title"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              SEO Description
            </label>
            <textarea
              value={form.seo_description}
              onChange={(e) =>
                setForm((f) => ({ ...f, seo_description: e.target.value }))
              }
              rows={2}
              placeholder="Custom SEO description"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-500 transition-all hover:-translate-y-0.5"
            style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
          >
            {loading ? "Saving..." : "Save Project"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-xl text-sm font-bold border-2 transition-all text-blue-500 hover:-translate-y-0.5"
            style={{ borderColor: "oklch(60% 0.18 232 / 0.15)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
