import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JustDailyBanter",
  description: "A simple MVP for a soccer daily summary app."
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
