import type { Metadata, Viewport } from "next";
import { Anuphan, Chakra_Petch } from "next/font/google";
import "./globals.css";
import "@/styles/chapter-3.css";
import "@/styles/chapter-4.css";
import "@/styles/opening.css";

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ทุกนาทีที่ช้า คือสมองที่สูญเสีย | ตัวอย่างบทที่ 3–4",
  description:
    "สื่อการสอนโรคหลอดเลือดสมอง: เวลาทำอะไรกับสมองเมื่อเกิดสโตรก และฝึกจับสัญญาณเตือนด้วย BEFAST",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F7FC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1330" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${anuphan.variable} ${chakraPetch.variable}`}>
      <body>{children}</body>
    </html>
  );
}
