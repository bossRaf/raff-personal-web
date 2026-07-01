"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ArrowRight, ExternalLink } from "lucide-react";

interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
}

interface Settings {
  hero_content: HeroContent;
  social_links: { platform: string; url: string }[];
}

const terminalLines = [
  { prompt: "~", command: "npx create-next-app@latest portfolio" },
  { prompt: "~", command: "cd portfolio && npm install @supabase/ssr" },
  { prompt: "~", command: "vercel deploy --prod" },
  {
    prompt: "~",
    command: "deployment status",
    output: "● WEB URL: https://raffsimplified.vercel.app",
  },
];

export default function HomePage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [terminalStep, setTerminalStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase
      .from("settings")
      .select("hero_content, social_links")
      .single()
      .then(({ data }) => {
        if (data) setSettings(data as Settings);
      });
  }, []);

  useEffect(() => {
    if (terminalStep < terminalLines.length) {
      const timer = setTimeout(() => setTerminalStep((s) => s + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [terminalStep]);

  const hero = settings?.hero_content;

  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 py-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-blue-700">
                {hero?.title || (
                  <>
                    Building{" "}
                    <span style={{ color: "oklch(60% 0.18 232)" }}>
                      production-ready
                    </span>{" "}
                    web apps
                  </>
                )}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                {hero?.subtitle ||
                  "Full-stack developer specializing in Next.js and Supabase. I turn ideas into scalable, real-world systems."}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-blue-700 border border-blue-600 transition-all hover:-translate-y-0.5"
                style={{ background: "oklch(91.7% 0.08 205.041)" }}
                //style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
              >
                {hero?.cta || "Hire Me"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm border border-blue-700 transition-all hover:-translate-y-0.5 text-muted-foreground"
                style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
              >
                View Projects
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Find me on
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="https://github.com/bossRaf"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FaGithub className="h-5 w-5" />
                </Link>

                <Link
                  href="https://www.linkedin.com/in/raffy-maluya-47090a328"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FaLinkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Terminal */}
          <div className="w-full space-y-6">
            <div
              className="rounded-2xl border overflow-hidden shadow-2xl"
              style={{ backgroundColor: "oklch(15% 0.01 232)" }}
            >
              {/* Terminal header */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{
                  borderColor: "oklch(25% 0.02 232)",
                  backgroundColor: "oklch(18% 0.01 232)",
                }}
              >
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
                <span
                  className="ml-3 text-xs"
                  style={{ color: "oklch(55% 0.02 232)" }}
                >
                  ~/portfolio — zsh
                </span>
              </div>

              {/* Terminal body  min-h-55    min-h-[220px] */}
              <div className="p-5 font-mono text-sm space-y-3 min-h-55">
                {terminalLines.slice(0, terminalStep).map((line, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#00ffd5" }}>{line.prompt} $</span>
                      <span style={{ color: "oklch(85% 0.02 232)" }}>
                        {line.command}
                      </span>
                    </div>
                    {line.output && (
                      <div
                        style={{ color: "oklch(60% 0.08 232)" }}
                        className="pl-6"
                      >
                        {line.output}
                      </div>
                    )}
                  </div>
                ))}
                {mounted && terminalStep < terminalLines.length && (
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#00ffd5" }}>~ $</span>
                    <span
                      className="w-2 h-4 animate-pulse"
                      style={{ backgroundColor: "#00ffd5" }}
                    />
                  </div>
                )}
              </div>

              {/* Stack badges */}
              <div className="px-5 pb-5 flex flex-wrap gap-2">
                {[
                  "Next.js",
                  "TypeScript",
                  "Tailwind",
                  "Shadcn/ui",
                  "Supabase",
                  "Resend",
                  "Vercel",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-xs font-medium border"
                    style={{
                      borderColor: "oklch(30% 0.05 232)",
                      color: "oklch(70% 0.08 232)",
                      backgroundColor: "oklch(20% 0.02 232)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
