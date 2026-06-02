"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X, Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl border p-8 shadow-2xl"
        style={{ backgroundColor: "var(--card)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600">Admin Login</h2>
          <p className="text-sm text-blue-600 mt-1">
            Sign in to access the dashboard
          </p>
        </div>

        {/* Error notice */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm border"
            style={{
              backgroundColor: "oklch(95% 0.05 27)",
              borderColor: "oklch(80% 0.1 27)",
              color: "oklch(40% 0.15 27)",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-blue-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full px-3 py-2 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-blue-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg text-sm font-medium text-blue-600 transition-all duration-200 disabled:opacity-50"
            style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
