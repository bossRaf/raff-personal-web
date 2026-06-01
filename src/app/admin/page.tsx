"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FolderKanban,
  Mail,
  MailOpen,
  MessageSquareQuote,
  Clock,
} from "lucide-react";

interface Stats {
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
  totalTestimonials: number;
  pendingTestimonials: number;
}

interface RecentMessage {
  id: number;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalTestimonials: 0,
    pendingTestimonials: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);

  useEffect(() => {
    const supabase = createClient();

    async function fetchStats() {
      const [projects, messages, unread, testimonials, pending] =
        await Promise.all([
          supabase
            .from("projects")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("messages")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .eq("is_read", false),
          supabase
            .from("testimonials")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("testimonials")
            .select("id", { count: "exact", head: true })
            .eq("approved", false),
        ]);

      setStats({
        totalProjects: projects.count || 0,
        totalMessages: messages.count || 0,
        unreadMessages: unread.count || 0,
        totalTestimonials: testimonials.count || 0,
        pendingTestimonials: pending.count || 0,
      });
    }

    async function fetchRecentMessages() {
      const { data } = await supabase
        .from("messages")
        .select("id, email, message, created_at, is_read")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setRecentMessages(data);
    }

    fetchStats();
    fetchRecentMessages();
  }, []);

  const statCards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "oklch(60% 0.18 232)",
    },
    {
      label: "Total Messages",
      value: stats.totalMessages,
      icon: Mail,
      color: "oklch(60% 0.18 232)",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      icon: MailOpen,
      color: "oklch(70% 0.18 27)",
    },
    {
      label: "Total Testimonials",
      value: stats.totalTestimonials,
      icon: MessageSquareQuote,
      color: "oklch(60% 0.18 232)",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingTestimonials,
      icon: Clock,
      color: "oklch(70% 0.18 85)",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border p-5 space-y-3 transition-all cursor-default"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = card.color;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
                >
                  <Icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent messages */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-foreground">Recent Messages</h2>
        </div>
        {recentMessages.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No messages yet.
          </div>
        ) : (
          <div className="divide-y">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="px-6 py-4 flex items-start gap-4">
                <div
                  className="w-2 h-2 rounded-full mt-2 shrink-0"
                  style={{
                    backgroundColor: msg.is_read
                      ? "var(--border)"
                      : "oklch(60% 0.18 232)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {msg.email}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {msg.message}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">
                  {new Date(msg.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
