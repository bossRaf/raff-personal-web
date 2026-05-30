"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Skill {
  id: number;
  name: string;
  category: "frontend" | "backend" | "tools";
  icon: string;
  display_order: number;
}

const categories = ["frontend", "backend", "tools"] as const;

const emptyForm = {
  name: "",
  category: "frontend" as "frontend" | "backend" | "tools",
  icon: "",
  display_order: 0,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    const supabase = createClient();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("display_order");
    if (data) setSkills(data as Skill[]);
    setLoading(false);
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function openEdit(skill: Skill) {
    setForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || "",
      display_order: skill.display_order,
    });
    setEditingId(skill.id);
    setShowForm(true);
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();

    if (editingId) {
      const { error } = await supabase
        .from("skills")
        .update(form)
        .eq("id", editingId);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("skills").insert(form);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    closeForm();
    fetchSkills();
  }

  async function deleteSkill(id: number) {
    if (!confirm("Delete this skill?")) return;
    const supabase = createClient();
    await supabase.from("skills").delete().eq("id", id);
    fetchSkills();
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all";
  const inputStyle = {
    backgroundColor: "var(--background)",
    borderColor: "var(--border)",
  };

  const grouped = categories.reduce(
    (acc, cat) => {
      acc[cat] = skills.filter((s) => s.category === cat);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Manage your tech stack and skill categories
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:-translate-y-0.5"
          style={{ background: "oklch(60% 0.18 232)" }}
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">
              {editingId ? "Edit Skill" : "Add Skill"}
            </h2>
            <button
              onClick={closeForm}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

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

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                placeholder="e.g. Next.js"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as typeof form.category,
                  }))
                }
                className={inputClass}
                style={inputStyle}
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Icon (emoji)
              </label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) =>
                  setForm((f) => ({ ...f, icon: e.target.value }))
                }
                placeholder="e.g. ⚡"
                className={inputClass}
                style={inputStyle}
              />
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

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-all hover:-translate-y-0.5"
                style={{ background: "oklch(60% 0.18 232)" }}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Skill"
                    : "Add Skill"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2 rounded-xl text-sm font-medium border text-foreground transition-all hover:-translate-y-0.5"
                style={{ borderColor: "var(--border)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills grouped by category */}
      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          Loading...
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          No skills yet. Add your first skill.
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map(
            (cat) =>
              grouped[cat].length > 0 && (
                <div
                  key={cat}
                  className="rounded-2xl border overflow-hidden"
                  style={{ backgroundColor: "var(--card)" }}
                >
                  <div
                    className="px-6 py-3 border-b"
                    style={{ backgroundColor: "var(--background)" }}
                  >
                    <h3 className="text-sm font-semibold text-foreground capitalize">
                      {cat}
                    </h3>
                  </div>
                  <table className="w-full text-sm">
                    <tbody className="divide-y">
                      {grouped[cat].map((skill) => (
                        <tr
                          key={skill.id}
                          className="hover:bg-accent/30 transition-colors"
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              {skill.icon && (
                                <span className="text-xl">{skill.icon}</span>
                              )}
                              <span className="font-medium text-foreground">
                                {skill.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-muted-foreground text-xs">
                            Order: {skill.display_order}
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEdit(skill)}
                                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                              >
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => deleteSkill(skill.id)}
                                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                              >
                                <Trash2
                                  className="h-4 w-4"
                                  style={{ color: "oklch(55% 0.18 27)" }}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
