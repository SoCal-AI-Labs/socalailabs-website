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
  metadataBase: new URL("https://socalailabs.com"),
  title: {
    default: "SoCal AI Labs — We Build AI Systems That Work For You",
    template: "%s · SoCal AI Labs",
  },
  description:
    "SoCal AI Labs designs and deploys autonomous AI systems for small and mid-size businesses across Southern California — from lead generation to full operations automation.",
  keywords: [
    "AI consulting",
    "AI automation",
    "Southern California",
    "AI agents",
    "lead generation",
    "operations automation",
  ],
  openGraph: {
    title: "SoCal AI Labs — We Build AI Systems That Work For You",
    description:
      "Autonomous, production-ready AI systems for small and mid-size businesses. Southern California.",
    url: "/",
    siteName: "SoCal AI Labs",
    images: ["/logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoCal AI Labs",
    description: "We Build AI Systems That Work For You.",
    images: ["/logo.png"],
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Enable motion before first paint (when allowed) so reveal elements
            start hidden instead of flashing visible → hidden → fading in. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion')}}catch(e){}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
