"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

interface Project {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  github_url: string;
  live_url: string;
  featured: boolean;
  published: boolean;
  display_order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const supabase = createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("display_order");
    if (data) setProjects(data as Project[]);
    setLoading(false);
  }

  async function toggleFeatured(id: number, current: boolean) {
    const supabase = createClient();
    await supabase.from("projects").update({ featured: !current }).eq("id", id);
    fetchProjects();
  }

  async function togglePublished(id: number, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("projects")
      .update({ published: !current })
      .eq("id", id);
    fetchProjects();
  }

  function openDeleteModal(id: number) {
    setDeleteModal({ open: true, id });
  }

  async function handleDelete() {
    if (!deleteModal.id) return;
    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", deleteModal.id);
    setDeleteModal({ open: false, id: null });
    fetchProjects();
  }

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <a
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-500 transition-all hover:-translate-y-0.5"
            style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
          >
            <Plus className="h-4 w-4" />
            Add Project
          </a>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "var(--card)" }}
        >
          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : projects.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No projects yet. Add your first project.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  <th className="px-6 py-3 text-muted-foreground font-medium">
                    Title
                  </th>
                  <th className="px-6 py-3 text-muted-foreground font-medium">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-muted-foreground font-medium">
                    Published
                  </th>
                  <th className="px-6 py-3 text-muted-foreground font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="transition-colors hover:bg-accent/30"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {project.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {project.excerpt}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          toggleFeatured(project.id, project.featured)
                        }
                        className="transition-colors"
                        title="Toggle featured"
                      >
                        <Star
                          className="h-4 w-4"
                          style={{
                            fill: project.featured
                              ? "oklch(80% 0.18 85)"
                              : "transparent",
                            color: project.featured
                              ? "oklch(80% 0.18 85)"
                              : "var(--border)",
                          }}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          togglePublished(project.id, project.published)
                        }
                        className="transition-colors"
                        title="Toggle published"
                      >
                        {project.published ? (
                          <Eye
                            className="h-4 w-4"
                            style={{ color: "oklch(60% 0.18 232)" }}
                          />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/projects/${project.id}/edit`}
                          className="p-1.5 rounded-lg transition-colors hover:bg-accent"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </a>
                        <button
                          onClick={() => openDeleteModal(project.id)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-accent"
                          title="Delete"
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
          )}
        </div>
      </div>
    </>
  );
}
