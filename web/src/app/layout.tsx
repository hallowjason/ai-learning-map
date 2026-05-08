import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Local creamfont — Next.js handles path + basePath + injects @font-face,
// avoiding the static-export pitfall where CSS url() doesn't get basePath.
const cream = localFont({
  src: "./fonts/creamfont.otf",
  variable: "--font-cream",
  display: "swap",
});

const notoSans = Noto_Sans_TC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AI 學習地圖",
  description: "每個人的 AI 學習旅程，從村莊到山頂",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-Hant"
      className={`${cream.variable} ${notoSans.variable} ${notoSerif.variable} h-full`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
