"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, X, Trash2, Star } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  approved: boolean;
  image?: string | null;
  created_at: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    const supabase = createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTestimonials(data as Testimonial[]);
    setLoading(false);
  }

  async function approve(id: number) {
    const supabase = createClient();
    await supabase.from("testimonials").update({ approved: true }).eq("id", id);
    fetchTestimonials();
  }

  async function reject(id: number) {
    const supabase = createClient();
    await supabase
      .from("testimonials")
      .update({ approved: false })
      .eq("id", id);
    fetchTestimonials();
  }

  function openDeleteModal(id: number) {
    setDeleteModal({ open: true, id });
  }

  async function handleDelete() {
    if (!deleteModal.id) return;
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", deleteModal.id);
    setDeleteModal({ open: false, id: null });
    fetchTestimonials();
  }

  function handleImageError(id: number) {
    setBrokenImages((prev) => new Set(prev).add(id));
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  }

  const filtered = testimonials.filter((t) => {
    if (filter === "pending") return !t.approved;
    if (filter === "approved") return t.approved;
    return true;
  });

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
      <div className="space-y-6"></div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Filter tabs */}
          <div className="flex gap-2">
            {(["all", "pending", "approved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-blue-500 border transition-all capitalize"
                style={{
                  backgroundColor:
                    filter === f ? "oklch(60% 0.18 232 / 0.15)" : "transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>
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
          ) : filtered.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No testimonials found.
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((t) => (
                <div key={t.id} className="p-6 space-y-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar: photo or initials fallback */}
                      {t.image && !brokenImages.has(t.id) ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          onError={() => handleImageError(t.id)}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ backgroundColor: "oklch(60% 0.18 232)" }}
                        >
                          {getInitials(t.name)}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}
                          {t.company ? ` · ${t.company}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Status + Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: t.approved
                            ? "oklch(60% 0.18 150 / 0.15)"
                            : "oklch(70% 0.18 85 / 0.15)",
                          color: t.approved
                            ? "oklch(45% 0.18 150)"
                            : "oklch(50% 0.18 85)",
                        }}
                      >
                        {t.approved ? "Approved" : "Pending"}
                      </span>

                      {!t.approved && (
                        <button
                          onClick={() => approve(t.id)}
                          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                          title="Approve"
                        >
                          <Check
                            className="h-4 w-4"
                            style={{ color: "oklch(55% 0.18 150)" }}
                          />
                        </button>
                      )}
                      {t.approved && (
                        <button
                          onClick={() => reject(t.id)}
                          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                          title="Reject"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(t.id)}
                        className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                        title="Delete"
                      >
                        <Trash2
                          className="h-4 w-4"
                          style={{ color: "oklch(55% 0.18 27)" }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5"
                        style={{
                          fill:
                            i < t.rating ? "oklch(80% 0.18 85)" : "transparent",
                          color:
                            i < t.rating
                              ? "oklch(80% 0.18 85)"
                              : "var(--border)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="text-sm text-muted-foreground italic">
                    "{t.message}"
                  </p>

                  {/* Date */}
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
