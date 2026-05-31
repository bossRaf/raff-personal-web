"use client";

import { Trash2, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border p-8 shadow-2xl"
        style={{ backgroundColor: "var(--card)" }}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: "oklch(55% 0.18 27 / 0.15)" }}
        >
          <Trash2 className="h-5 w-5" style={{ color: "oklch(55% 0.18 27)" }} />
        </div>

        {/* Content */}
        <h2 className="text-lg font-bold text-foreground mb-2">
          Confirm Delete
        </h2>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:-translate-y-0.5"
            style={{ background: "oklch(55% 0.18 27)" }}
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all hover:-translate-y-0.5 text-foreground"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
