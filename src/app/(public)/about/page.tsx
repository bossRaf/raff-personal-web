"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Clock, Download, Mail } from "lucide-react";

interface AboutContent {
  name: string;
  role: string;
  location: string;
  available: boolean;
  bio: string[];
  timeline: { year: string; title: string; company: string }[];
}

interface Settings {
  about_content: AboutContent;
  resume_url: string;
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("about_content, resume_url")
      .single()
      .then(({ data }) => {
        if (data) setSettings(data as Settings);
      });
  }, []);

  const about = settings?.about_content;

  const defaultBio = [
    "I'm currently a 4th year Computer Science student and self learning full-stack developer who builds production-ready web applications with a strong focus on security, scalability, and clean architecture. I enjoy turning complex problems into elegant, maintainable systems.",
    "I care deeply about the developer experience too. Clean folder structures, readable code, and thorough documentation so any future developer (or future me) can pick up where things left off.",
  ];

  const defaultTimeline = [
    {
      year: "2026",
      title: "Freelance Full-Stack Developer",
      company: "Self-employed",
    },
    {
      year: "2024",
      title: "Full-Stack Projects",
      company: "School & Personal",
    },
    {
      year: "2024",
      title: "Started Self-Learning",
      company: "W3school & Documentions",
    },
  ];

  const bio = about?.bio?.length ? about.bio : defaultBio;
  const timeline = about?.timeline?.length ? about.timeline : defaultTimeline;

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 py-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT — Sticky profile card */}
          <div className="lg:col-span-1">
            <div
              className="lg:sticky lg:top-24 rounded-2xl border overflow-hidden"
              style={{ backgroundColor: "var(--card)" }}
            >
              {/* Profile picture */}
              <div
                className="m-3 rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "oklch(60% 0.18 232 / 0.15)",
                  aspectRatio: "1 / 1",
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-500">
                  {about?.name
                    ? about.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                    : "Photo"}
                </div>
              </div>

              {/* Info */}
              <div className="px-5 pt-4 pb-5 space-y-4">
                {/* Name + Role */}
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-bold text-blue-500">
                    {about?.name || "Raffy Maluya"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {about?.role || "Full-Stack Developer"}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2 border-t pt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{about?.location || "Masbate, PH"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>UTC+8 · Philippines</span>
                  </div>
                </div>

                {/* Resume download */}
                <div className="flex gap-2">
                  <a
                    href={settings?.resume_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xm font-bold text-blue-500 border transition-all hover:-translate-y-0.5"
                    style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
                  >
                    <Download className="h-4 w-4" />
                    Resume
                  </a>

                  <a
                    href="/contact"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:-translate-y-0.5 text-blue-500"
                    style={{ borderColor: "oklch(60% 0.18 232 / 0.15)" }}
                  >
                    <Mail className="h-4 w-4" />
                    Message
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Bio + Timeline */}
          <div className="lg:col-span-2 space-y-10">
            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-3xl font-semibold text-blue-500">
                Background
              </h3>
              <div className="space-y-3">
                {bio.map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="mb-12">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm"
                style={{
                  borderColor: "oklch(74.6% 0.16 232.661)",
                  color: "oklch(50% 0.18 232)",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: "#00ffd5" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: "#00ffd5" }}
                  />
                </span>
                Available for Freelance and Collaboration
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-3xl font-semibold text-blue-500">
                Career Journey
              </h3>
              <div className="space-y-0">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {/* Content */}
                    <div className="pb-8 space-y-0.5">
                      <p className="text-xs text-muted-foreground">
                        {item.year}
                      </p>
                      <p className="font-semibold text-blue-500">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
