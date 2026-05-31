"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getActiveBg = () => {
    if (!mounted) return "oklch(74.6% 0.16 232.661)";
    return theme === "dark"
      ? "oklch(35% 0.05 232)"
      : "oklch(74.6% 0.16 232.661)";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          <span style={{ color: "oklch(60% 0.18 232)" }}>raff</span>
          <span className="text-foreground">Simplified</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent text-foreground ${
                pathname === link.href ? "font-medium" : ""
              }`}
              style={{
                backgroundColor:
                  pathname === link.href ? getActiveBg() : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/contact" className="relative inline-block group">
            {/* Glow */}
            <div
              className="absolute -inset-6.25 rounded-full opacity-50 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,255,213,0.25), transparent 60%)",
                filter: "blur(20px)",
                zIndex: 0,
              }}
              // -inset-6.25    inset-[-25px]
            />
            {/* Animated border wrapper */}
            <div
              className="hire-btn-wrapper relative rounded-xl p-0.5"
              style={{ zIndex: 2 }}
            >
              {/* Inner button       p-0.5        p-[2px]  */}
              <div
                className="relative px-5 py-2 text-sm font-medium rounded-[10px] cursor-pointer transition-all duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.02] overflow-hidden"
                style={{
                  background:
                    mounted && resolvedTheme === "dark"
                      ? "oklch(50% 0.15 232)"
                      : "oklch(60% 0.18 232)",
                  color: "white",
                }}
              >
                {/* Dot        top-2.5  top-[10px],  left-3    left-[12px]  */}
                <div
                  className="dot absolute top-2.5 left-3 w-1.5 h-1.5 rounded-full"
                  style={{ background: "#00ffd5" }}
                />
                {/* Shimmer */}
                <div className="hire-shimmer absolute top-0 left-0 w-full h-full rounded-[10px] pointer-events-none" />
                <span className="relative z-10 pl-3">Hire Me</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
