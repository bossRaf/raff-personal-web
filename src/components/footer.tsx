"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import { LoginModal } from "@/components/login-modal";

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <footer className="border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-3">
              <span
                className="font-bold text-lg tracking-tight"
                style={{ color: "oklch(60% 0.18 232)" }}
              >
                raff
              </span>
              <span className="text-foreground font-bold text-lg">
                Simplified
              </span>
              <p className="text-sm text-muted-foreground">
                Building production-ready web applications with modern
                technologies.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="https://github.com/bossRaf"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FaGithub className="h-4 w-4" />
                </Link>

                <Link
                  href="https://www.linkedin.com/in/raffy-maluya-47090a328"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FaLinkedin className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-blue-600">Navigation</h4>
              <ul className="space-y-2">
                {[
                  "Home",
                  "About",
                  "Skills",
                  "Projects",
                  "Testimonials",
                  "Contact",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-blue-600">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://github.com/bossRaf"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/in/raffy-maluya-47090a328"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>

            {/* More */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-blue-600">More</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/projects"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Hire Me
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} raffSimplified All rights reserved.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="text-[8px] text-muted-foreground/30 hover:text-muted-foreground transition-colors"
            >
              ==
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
