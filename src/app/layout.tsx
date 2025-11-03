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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
