import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Assignment",
  description: "Assignment for SnabbTech! INTERNSHALA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="darkreader" content="random phrase here"></meta>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
