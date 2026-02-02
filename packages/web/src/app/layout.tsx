import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThrumHub - Snippet Registry",
  description: "Discover and share automation snippets for Thrum",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-300 min-h-screen antialiased">
        <Providers>
          <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
              <a href="/" className="text-teal-400 font-bold text-lg tracking-tight">
                ThrumHub
              </a>
              <div className="flex items-center gap-6 text-sm">
                <a href="/" className="hover:text-teal-400 transition-colors">
                  Browse
                </a>
                <a href="/submit" className="hover:text-teal-400 transition-colors">
                  Submit
                </a>
                <a href="/dashboard" className="hover:text-teal-400 transition-colors">
                  Dashboard
                </a>
                <a
                  href="/login"
                  className="bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-md hover:bg-teal-500/20 transition-colors"
                >
                  Sign In
                </a>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
