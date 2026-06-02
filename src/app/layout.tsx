import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://raffsimplified.vercel.app"),

  title: {
    default: "Raffy Maluya | Full-Stack Developer",
    template: "%s | raffSimplified",
  },

  description:
    "Full-Stack Developer specializing in Next.js, TypeScript, Supabase, PostgreSQL, and scalable production-ready web applications.",

  openGraph: {
    title: "Raffy Maluya | Full-Stack Developer",
    description:
      "Full-Stack Developer specializing in Next.js, TypeScript, Supabase, PostgreSQL, and scalable production-ready web applications.",
    url: "https://raffsimplified.vercel.app",
    siteName: " raffSimplified",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Raffy Maluya | Full-Stack Developer",
    description:
      "Full-Stack Developer specializing in Next.js, TypeScript, Supabase, PostgreSQL, and scalable production-ready web applications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
