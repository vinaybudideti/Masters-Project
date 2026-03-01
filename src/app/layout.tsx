import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriBot — AI Nutrition Assistant",
  description:
    "Personalized nutrition advice and meal planning powered by Claude claude-sonnet-4-6. Get instant, evidence-based meal recommendations tailored to your diet and goals.",
  keywords: ["nutrition", "meal planning", "AI", "diet", "health", "keto", "vegan"],
  authors: [{ name: "NutriBot" }],
  openGraph: {
    title: "NutriBot — AI Nutrition Assistant",
    description: "Personalized nutrition advice powered by Claude claude-sonnet-4-6",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-primary text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
