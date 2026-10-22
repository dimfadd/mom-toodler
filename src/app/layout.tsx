import type { Metadata, Viewport } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { Montserrat } from "next/font/google";
import { copy } from "@/content/copy";
import "./globals.css";

// Brand font: Nexa Pro (Fontfabric, commercial). It is used only when licensed files are placed in
// public/fonts (see public/fonts/README.md). Until then Montserrat, the closest free geometric sans,
// is used so the page never shows a missing-font request.
const montserrat = Montserrat({
  variable: "--font-fallback",
  subsets: ["latin"],
  display: "swap",
});

const NEXA_WEIGHTS: [file: string, weight: number][] = [
  ["NexaPro-Regular.woff2", 400],
  ["NexaPro-Bold.woff2", 700],
  ["NexaPro-Heavy.woff2", 800],
];
const nexaFaces = NEXA_WEIGHTS.filter(([file]) => existsSync(path.join(process.cwd(), "public", "fonts", file)))
  .map(([file, weight]) => `@font-face{font-family:"Nexa Pro";src:url("/fonts/${file}") format("woff2");font-weight:${weight};font-style:normal;font-display:swap}`)
  .join("");

export const metadata: Metadata = {
  title: copy.id.meta.title,
  description: copy.id.meta.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#121a16" },
  ],
};

// Sets the theme before first paint so the page never flashes the wrong colors.
const themeScript = `(function(){try{var t=localStorage.getItem("app-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-theme="light"
      suppressHydrationWarning
      className={`${montserrat.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {nexaFaces && <style dangerouslySetInnerHTML={{ __html: nexaFaces }} />}
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
