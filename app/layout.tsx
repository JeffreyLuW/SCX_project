import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCX Model Comparison",
  description: "Compare AI models side by side using SCX.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
