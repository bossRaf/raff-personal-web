import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const disposableDomains = [
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "trashmail.com",
  "fakeinbox.com",
];

function isDisposable(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return disposableDomains.includes(domain);
}

// Helper to safely escape raw strings for HTML delivery
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, message } = body;

    // 1. Basic Validations
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }
    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 },
      );
    }

    // 2. Disposable Email Filter
    if (isDisposable(email)) {
      return NextResponse.json(
        { error: "Disposable email addresses are not allowed." },
        { status: 400 },
      );
    }

    // 3. Resolve and Anonymize IP
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const ipHash = crypto.createHash("sha256").update(rawIp).digest("hex");

    const supabase = await createClient();

    // 4. Serverless-Safe Rate Limiting via Postgres
    // Look back 1 hour ago for submissions from this specific hashed IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);

    if (countError) {
      return NextResponse.json(
        { error: "Server verification failed." },
        { status: 500 },
      );
    }

    if (count && count >= 3) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 },
      );
    }

    // 5. Secure database entry
    const { error: dbError } = await supabase.from("messages").insert({
      email,
      message,
      ip_hash: ipHash, // Safely stored as a non-reversible hash
      user_agent: req.headers.get("user-agent") || "",
    });

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to save message." },
        { status: 500 },
      );
    }

    // 6. Sanitized Email Delivery
    const cleanMessage = escapeHtml(message);

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "raffsimplified@gmail.com",
      subject: `New message from ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0ea5e9;">New Contact Message</h2>
          <p><strong>From:</strong> ${email}</p>
          <hr style="border: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="white-space: pre-wrap;">${cleanMessage}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
