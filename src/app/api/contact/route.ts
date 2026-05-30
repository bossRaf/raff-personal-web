import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

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

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const limit = 3;

  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, message } = body;

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

    // Disposable email check
    if (isDisposable(email)) {
      return NextResponse.json(
        { error: "Disposable email addresses are not allowed." },
        { status: 400 },
      );
    }

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 },
      );
    }

    // Save to Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("messages").insert({
      email,
      message,
      ip_hash: ip,
      user_agent: req.headers.get("user-agent") || "",
    });

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to save message." },
        { status: 500 },
      );
    }

    // Send email via Resend
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "raffsimplified@gmail.com",
      subject: `New message from ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0ea5e9;">New Contact Message</h2>
          <p><strong>From:</strong> ${email}</p>
          <hr style="border: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
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
