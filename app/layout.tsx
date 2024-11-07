import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Navbar />
        <div className="pt-16">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

export const metadata = {
  title: "MovieScope - Discover Your Next Movie",
  description:
    "MovieScope is a modern web application for discovering movies...",
};
