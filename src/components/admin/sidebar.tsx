"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  MessageSquareQuote,
  Mail,
  FileText,
  Settings,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
  },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/resume", label: "Resume", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({
  pathname,
  onNavClick,
  handleLogout,
  mounted,
  resolvedTheme,
  setTheme,
}: {
  pathname: string;
  onNavClick?: () => void;
  handleLogout: () => void;
  mounted: boolean;
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b">
        <Link
          href="/admin"
          className="font-bold text-lg tracking-tight"
          onClick={onNavClick}
        >
          <span style={{ color: "oklch(60% 0.18 232)" }}>raff</span>
          <span className="text-foreground">Simplified</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-600 font-medium transition-all"
              style={{
                backgroundColor: isActive
                  ? "oklch(60% 0.18 232 / 0.15)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor =
                    "oklch(60% 0.18 232 / 0.1)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t space-y-1">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 transition-all hover:bg-accent"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4 shrink-0" />
          ) : (
            <Moon className="h-4 w-4 shrink-0" />
          )}
          {mounted && resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: "oklch(55% 0.18 27)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "oklch(55% 0.18 27 / 0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const sharedProps = {
    pathname,
    handleLogout,
    mounted,
    resolvedTheme,
    setTheme,
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-60 shrink-0 h-screen sticky top-0 flex-col border-r"
        style={{ backgroundColor: "var(--card)" }}
      >
        <SidebarContent {...sharedProps} />
      </aside>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 border-b"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-bold text-lg tracking-tight">
            <img
              src="/brandLogo.png"
              alt="Raff Simplified Logo"
              width={35}
              height={35}
              style={{ borderRadius: "8px" }}
            />
          </Link>
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <aside
            ref={sidebarRef}
            className="w-64 h-full flex flex-col border-r"
            style={{ backgroundColor: "var(--card)" }}
          >
            <SidebarContent
              {...sharedProps}
              onNavClick={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}
