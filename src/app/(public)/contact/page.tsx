"use client";

import { useState } from "react";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { FaGithub, FaFacebook } from "react-icons/fa";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setEmail("");
    setMessage("");
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all";
  const inputStyle = {
    backgroundColor: "var(--background)",
    borderColor: "var(--border)",
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 py-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT — Info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Let's build something amazing together
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                I'm currently available for freelance, collaboraion and
                full-time opportunities. Whether you have a project in mind or
                just want to say hello, my inbox is always open.
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                >
                  <FaGithub
                    className="h-4 w-4"
                    style={{ color: "oklch(60% 0.18 232)" }}
                  />
                </div>
                <span>github.com/bossRaf</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                >
                  <Mail
                    className="h-4 w-4"
                    style={{ color: "oklch(60% 0.18 232)" }}
                  />
                </div>
                <span>raffsimplified@gmail.com</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                >
                  <FaFacebook
                    className="h-4 w-4"
                    style={{ color: "oklch(60% 0.18 232)" }}
                  />
                </div>
                <span>Raf Maluya</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                >
                  <MapPin
                    className="h-4 w-4"
                    style={{ color: "oklch(60% 0.18 232)" }}
                  />
                </div>
                <span>Masbate, Philippines</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                >
                  <Clock
                    className="h-4 w-4"
                    style={{ color: "oklch(60% 0.18 232)" }}
                  />
                </div>
                <span>UTC+8 · Usually responds within 24 hours</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div
            className="rounded-2xl border overflow-hidden shadow-2xl"
            style={{ backgroundColor: "oklch(15% 0.01 232)" }}
          >
            {/* Card header */}
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
                ~/contact — message.ts
              </span>
            </div>

            <div className="p-8">
              {success ? (
                <div className="text-center py-10 space-y-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl"
                    style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                  >
                    ✓
                  </div>
                  <h3 className="font-bold text-white text-lg">
                    Message sent!
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(65% 0.02 232)" }}
                  >
                    Thanks for reaching out. I'll get back to you as soon as
                    possible.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 text-sm underline transition-colors"
                    style={{ color: "oklch(65% 0.02 232)" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">
                      Send a message
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(55% 0.02 232)" }}
                    >
                      Protected by Zod validation & spam detection
                    </p>
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

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className={inputClass}
                      style={{
                        backgroundColor: "oklch(20% 0.02 232)",
                        borderColor: "oklch(30% 0.05 232)",
                        color: "oklch(85% 0.02 232)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      placeholder="Tell me about your project or just say hello..."
                      className={inputClass}
                      style={{
                        backgroundColor: "oklch(20% 0.02 232)",
                        borderColor: "oklch(30% 0.05 232)",
                        color: "oklch(85% 0.02 232)",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 hover:-translate-y-0.5"
                    style={{ background: "oklch(60% 0.18 232)" }}
                  >
                    <Send className="h-4 w-4" />
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
