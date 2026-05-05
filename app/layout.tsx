import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Club Brief",
  description: "A simple placeholder AC Milan sports news summary website."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
