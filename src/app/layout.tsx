import type { Metadata } from "next";
import { Noto_Sans_Khmer, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoKhmer = Noto_Sans_Khmer({
  variable: "--font-khmer",
  subsets: ["khmer"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase:
    process.env.NODE_ENV === "development"
      ? new URL("http://localhost:3000")
      : new URL("https://launchly.vercel.app"),
  title: "Launchly - Deploy Websites Automatically wth SSL & Domains",
  description:
    "Launchly lets you deploy websites from GitHub or GitLab in seconds, with automatic SSL and domain setup - all powered by Linux automation.",
  openGraph: {
    title: "Launchly - Fast, Simple, and Secure Web Deployment",
    description:
      "Launch your site instantly from your Git repository. Launchly automates deployment, SSL, and domain management for developers.",
    url: "https://launchly.vercel.app/",
    siteName: "Launchly",
    images: [
      {
        url: "/og-launchly.png",
        width: 1200,
        height: 630,
        alt: "Launchly - Deploy Websites Automatically wth SSL & Domains",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Launchly - Deploy Websites Automatically wth SSL & Domains",
    description:
      "Deploy from GitHub or GitLab in seconds with automatic SSL and domain setup.",
    images: ["/og-launchly.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${notoKhmer.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500`}
      >
        <Navbar />
        <main className="pt-20 font-sans">{children}</main>
      </body>
    </html>
  );
}
