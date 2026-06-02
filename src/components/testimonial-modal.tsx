"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Star } from "lucide-react";

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestimonialModal({ isOpen, onClose }: TestimonialModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.from("testimonials").insert({
      name,
      role,
      company: company || null,
      image: image || null,
      message,
      rating,
      approved: false,
    });

    if (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all";
  const inputStyle = {
    backgroundColor: "var(--background)",
    borderColor: "var(--border)",
  };

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImage("");

    const supabase = createClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `profile-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      setError(uploadError.message);
      setImage("");
      return;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    setImage(data.publicUrl);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border p-8 shadow-2xl"
        style={{ backgroundColor: "var(--card)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Leave a Testimonial
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your feedback will be reviewed before publishing.
          </p>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl"
              style={{ backgroundColor: "oklch(60% 0.18 232 / 0.15)" }}
            >
              ✓
            </div>
            <h3 className="font-bold text-foreground text-lg">Thank you!</h3>
            <p className="text-sm text-muted-foreground">
              Your testimonial has been submitted and is pending review.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 rounded-xl text-sm font-medium text-white"
              style={{ background: "oklch(60% 0.18 232)" }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
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

            {/* Rating */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star
                      className="h-6 w-6 transition-colors"
                      style={{
                        fill:
                          i < (hoveredRating || rating)
                            ? "oklch(80% 0.18 85)"
                            : "transparent",
                        color:
                          i < (hoveredRating || rating)
                            ? "oklch(80% 0.18 85)"
                            : "var(--border)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                placeholder="Software Engineer"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {/* Company */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Company{" "}
                <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {/* Image */}

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Share your experience working with me..."
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
              style={{ background: "oklch(60% 0.18 232)" }}
            >
              {loading ? "Submitting..." : "Submit Testimonial"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
