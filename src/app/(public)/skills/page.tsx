"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Skill {
  id: number;
  name: string;
  category: "frontend" | "backend" | "tools";
  icon: string;
  display_order: number;
}

const categories = ["all", "frontend", "backend", "tools"] as const;
type Category = (typeof categories)[number];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [active, setActive] = useState<Category>("all");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("skills")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        if (data) setSkills(data as Skill[]);
      });
  }, []);

  const filtered =
    active === "all" ? skills : skills.filter((s) => s.category === active);

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 py-16">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <h6 className="text-center text-xl font-bold text-blue-500">
            Technologies I use to build production-ready systems
          </h6>
        </div>

        {/* Filter tabs */}

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border text-blue-500 transition-all capitalize"
              style={{
                backgroundColor:
                  active === cat ? "oklch(60% 0.18 232 / 0.15)" : "transparent",
                borderColor:
                  active === cat ? "oklch(60% 0.18 232)" : "var(--border)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No skills added yet. Add them from the admin dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border p-4 flex flex-col items-center gap-2 text-center transition-all hover:-translate-y-1 hover:border-opacity-100 group cursor-default"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "oklch(60% 0.18 232)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                {skill.icon ? (
                  <span className="text-3xl">{skill.icon}</span>
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: "oklch(60% 0.18 232)" }}
                  >
                    {skill.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <p className="text-sm font-medium text-foreground">
                  {skill.name}
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full capitalize"
                  style={{
                    backgroundColor: "oklch(60% 0.18 232 / 0.15)",
                    color: "oklch(50% 0.18 232)",
                  }}
                >
                  {skill.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
