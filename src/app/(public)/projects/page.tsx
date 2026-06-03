"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface Skill {
  name: string;
}

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
  skills: { skills: Skill }[];
}

type Filter = "all" | "featured";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState<Filter>("all");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("projects")
      .select("*, skills:project_skills(skills(name))")
      .eq("published", true)
      .order("display_order")
      .then(({ data }) => {
        if (data) setProjects(data as Project[]);
      });
  }, []);

  const filtered =
    active === "all" ? projects : projects.filter((p) => p.featured);

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 py-16">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <h6 className="text-center text-xl font-bold text-blue-500">
            Real-world systems I've built and shipped
          </h6>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(["all", "featured"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border text-blue-500 transition-all capitalize"
              style={{
                backgroundColor:
                  active === f ? "oklch(60% 0.18 232 / 0.15)" : "transparent",
                borderColor:
                  active === f ? "oklch(60% 0.18 232)" : "var(--border)",
              }}
            >
              {f === "all" ? "All Projects" : "Featured"}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No projects added yet. Add them from the admin dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border-2 border-blue-600 overflow-hidden transition-all hover:-translate-y-1 group relative"
                style={{
                  backgroundColor: "var(--card)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "oklch(60% 0.18 232)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "oklch(60% 0.18 232)")
                }
              >
                {/* Thumbnail */}
                <div
                  className="relative w-full h-56 overflow-hidden"
                  style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl font-bold"
                      style={{ color: "oklch(60% 0.18 232)" }}
                    >
                      {project.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  {project.featured && (
                    <span
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold text-blue-500 border"
                      style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                    >
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-blue-500 text-lg">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {project.excerpt}
                  </p>

                  {/* Stack badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills?.slice(0, 4).map((ps, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-xs text-blue-500 font-medium"
                        style={{
                          backgroundColor: "oklch(60% 0.18 232 / 0.15)",
                          //color: "oklch(50% 0.18 232)",
                        }}
                      >
                        {ps.skills?.name}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-1">
                    {project.live_url && (
                      <Link
                        href={project.live_url}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-500 transition-colors hover:opacity-80"
                        style={{ color: "oklch(60% 0.18 232)" }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Live Demo
                      </Link>
                    )}
                    {project.github_url && (
                      <Link
                        href={project.github_url}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground px-4 py-1.5 rounded-full border border-blue-500 hover:text-foreground transition-colors"
                      >
                        <FaGithub className="h-3.5 w-3.5" />
                        Github Repository
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
