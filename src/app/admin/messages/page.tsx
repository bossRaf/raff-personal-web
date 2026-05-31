"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, MailOpen, Mail } from "lucide-react";

interface Message {
  id: number;
  email: string;
  message: string;
  is_read: boolean;
  is_spam: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "spam">("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data as Message[]);
    setLoading(false);
  }

  async function markAsRead(id: number) {
    const supabase = createClient();
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    fetchMessages();
  }

  async function markAsSpam(id: number, current: boolean) {
    const supabase = createClient();
    await supabase.from("messages").update({ is_spam: !current }).eq("id", id);
    fetchMessages();
  }

  async function deleteMessage(id: number) {
    if (!confirm("Delete this message?")) return;
    const supabase = createClient();
    await supabase.from("messages").delete().eq("id", id);
    fetchMessages();
  }

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "spam") return m.is_spam;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-foreground">
            View and manage contact form submissions
          </h4>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["all", "unread", "spam"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize"
              style={{
                backgroundColor:
                  filter === f ? "oklch(60% 0.18 232)" : "transparent",
                borderColor:
                  filter === f ? "oklch(60% 0.18 232)" : "var(--border)",
                color: filter === f ? "white" : "var(--muted-foreground)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
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
            No messages found.
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                className="p-6 space-y-2 transition-colors"
                style={{
                  backgroundColor: !msg.is_read
                    ? "oklch(60% 0.18 232 / 0.05)"
                    : "transparent",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                      style={{
                        backgroundColor: msg.is_read
                          ? "transparent"
                          : "oklch(60% 0.18 232)",
                        border: msg.is_read
                          ? "1px solid var(--border)"
                          : "none",
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {msg.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleDateString()} ·{" "}
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {msg.is_spam && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "oklch(55% 0.18 27 / 0.15)",
                          color: "oklch(45% 0.18 27)",
                        }}
                      >
                        Spam
                      </span>
                    )}
                    {!msg.is_read && (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                        title="Mark as read"
                      >
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => markAsSpam(msg.id, msg.is_spam)}
                      className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                      title={msg.is_spam ? "Unmark spam" : "Mark as spam"}
                    >
                      <Mail
                        className="h-4 w-4"
                        style={{
                          color: msg.is_spam
                            ? "oklch(55% 0.18 27)"
                            : "var(--muted-foreground)",
                        }}
                      />
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
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

                {/* Message body */}
                <p className="text-sm text-muted-foreground leading-relaxed pl-5">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
