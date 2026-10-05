import type { Metadata, Viewport } from "next";
import { Anuphan, Chakra_Petch } from "next/font/google";
import { KeepWords } from "@/components/ui/KeepWords";
import "./globals.css";
import "@/styles/chapter-3.css";
import "@/styles/chapter-4.css";
import "@/styles/royal-prelude.css";
import "@/styles/opening.css";
import "@/styles/story.css";
import "@/styles/chapter-1.css";
import "@/styles/chapter-2.css";
import "@/styles/chapter-5.css";
import "@/styles/chapter-6.css";
import "@/styles/chapter-7.css";
import "@/styles/chapter-8.css";
import "@/styles/closing.css";
import "@/styles/shield.css";

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
  title: "ทุกนาทีที่ช้า คือสมองที่สูญเสีย | เดิน วิ่ง ปั่น ป้องกันอัมพาต ครั้งที่ 12",
  description:
    "สื่อการสอนโรคหลอดเลือดสมองแบบเลื่อนอ่าน: สโตรกคืออะไร ใครเสี่ยง ทำไมทุกนาทีมีค่า และจับสัญญาณเตือนด้วย BEFAST จากแคมเปญ Walk Run Bike ครั้งที่ 12 Fighting Stroke",
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
      <body>
        {children}
        <KeepWords />
      </body>
    </html>
  );
}
