"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Upload } from "lucide-react";

interface Skill {
  id: number;
  name: string;
  category: string;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    image: "",
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      const [projectRes, skillsRes, projectSkillsRes] = await Promise.all([
        supabase.from("projects").select("*").eq("id", id).single(),
        supabase.from("skills").select("*").order("name"),
        supabase.from("project_skills").select("skill_id").eq("project_id", id),
      ]);

      if (projectRes.data) {
        const p = projectRes.data;
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          description: p.description || "",
          excerpt: p.excerpt || "",
          github_url: p.github_url || "",
          live_url: p.live_url || "",
          featured: p.featured || false,
          published: p.published || false,
          display_order: p.display_order || 0,
          seo_title: p.seo_title || "",
          seo_description: p.seo_description || "",
          image: p.image || "",
        });
        if (p.image) setImagePreview(p.image);
      }

      if (skillsRes.data) setSkills(skillsRes.data as Skill[]);
      if (projectSkillsRes.data)
        setSelectedSkills(projectSkillsRes.data.map((s) => s.skill_id));

      setLoading(false);
    }

    fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleSkill = (skillId: number) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((s) => s !== skillId)
        : [...prev, skillId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    let imageUrl = form.image;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${form.slug}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(path, imageFile);
      if (uploadError) {
        setError("Image upload failed.");
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("projects")
      .update({ ...form, image: imageUrl })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    // Update project skills
    await supabase.from("project_skills").delete().eq("project_id", id);
    if (selectedSkills.length > 0) {
      await supabase.from("project_skills").insert(
        selectedSkills.map((skill_id) => ({
          project_id: parseInt(id),
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
          <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update your portfolio project.
          </p>
        </div>
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
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
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

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
          )}

          <label
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors hover:border-opacity-80"
            style={{ borderColor: "oklch(74.6% 0.16 232.661)" }}
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {imageFile ? imageFile.name : "Click to replace image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
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
                  display_order: parseInt(e.target.value) || 0,
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
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 hover:-translate-y-0.5"
            style={{ background: "oklch(60% 0.18 232)" }}
          >
            {saving ? "Saving..." : "Update Project"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-all text-foreground hover:-translate-y-0.5"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
