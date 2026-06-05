import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const logoUrl = "https://raffsimplified.vercel.app/brandLogo.png";

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0d1117",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow top right */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Background glow bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Actual logo */}
      <img
        src={logoUrl}
        width={120}
        height={120}
        style={{
          borderRadius: "24px",
          marginBottom: "28px",
        }}
      />

      {/* Name */}
      <div
        style={{
          fontSize: "64px",
          fontWeight: "bold",
          color: "#ffffff",
          letterSpacing: "-1px",
          marginBottom: "12px",
          display: "flex",
        }}
      >
        Raffy Maluya
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "28px",
          color: "#f97316",
          fontWeight: "600",
          marginBottom: "32px",
          display: "flex",
        }}
      >
        Full-Stack Developer
      </div>

      {/* Divider */}
      <div
        style={{
          width: "60px",
          height: "3px",
          backgroundColor: "#f97316",
          borderRadius: "2px",
          marginBottom: "32px",
          display: "flex",
        }}
      />

      {/* Stack pills */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
        }}
      >
        {[
          "Next.js",
          "TypeScript",
          "Supabase",
          "PostgreSQL",
          "Tailwind CSS",
        ].map((tech) => (
          <div
            key={tech}
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(249,115,22,0.4)",
              color: "#fdba74",
              fontSize: "20px",
              backgroundColor: "rgba(249,115,22,0.08)",
              display: "flex",
            }}
          >
            {tech}
          </div>
        ))}
      </div>

      {/* Domain */}
      <div
        style={{
          position: "absolute",
          bottom: "36px",
          color: "#4b5563",
          fontSize: "18px",
          display: "flex",
        }}
      >
        raffsimplified.vercel.app
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
