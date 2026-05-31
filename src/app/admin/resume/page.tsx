"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, FileText, ExternalLink } from "lucide-react";

export default function AdminResumePage() {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("resume_url")
      .single()
      .then(({ data }) => {
        if (data?.resume_url) setCurrentUrl(data.resume_url);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setSuccess(false);

    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from("resume")
      .upload("resume/resume.pdf", file, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (uploadError) {
      setError("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("resume")
      .getPublicUrl("resume/resume.pdf");

    await supabase
      .from("settings")
      .update({ resume_url: urlData.publicUrl })
      .eq("id", 1);

    setCurrentUrl(urlData.publicUrl);
    setSuccess(true);
    setFile(null);
    setUploading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h4 className="text-xl font-bold text-foreground">
          Upload or replace your resume PDF. The public URL stays the same
        </h4>
      </div>

      {/* Current resume */}
      {currentUrl && (
        <div
          className="rounded-2xl border p-6 space-y-3"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2 className="font-semibold text-foreground">Current Resume</h2>
          <div
            className="flex items-center gap-3 p-4 rounded-xl border"
            style={{ borderColor: "oklch(74.6% 0.16 232.661)" }}
          >
            <FileText
              className="h-8 w-8 shrink-0"
              style={{ color: "oklch(60% 0.18 232)" }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">resume.pdf</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUrl}
              </p>
            </div>

            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-accent transition-colors shrink-0"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      )}

      {/* Upload */}
      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h2 className="font-semibold text-foreground">
          {currentUrl ? "Replace Resume" : "Upload Resume"}
        </h2>

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

        {success && (
          <div
            className="px-4 py-3 rounded-lg text-sm border"
            style={{
              backgroundColor: "oklch(95% 0.05 150)",
              borderColor: "oklch(80% 0.1 150)",
              color: "oklch(40% 0.15 150)",
            }}
          >
            Resume uploaded successfully! Public URL remains the same.
          </div>
        )}

        <label
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors hover:border-opacity-80"
          style={{ borderColor: "oklch(74.6% 0.16 232.661)" }}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {file ? file.name : "Click to select PDF"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF files only · Max 5MB
            </p>
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 hover:-translate-y-0.5"
          style={{ background: "oklch(60% 0.18 232)" }}
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>
    </div>
  );
}
