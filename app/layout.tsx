import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/ui/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dollar Growth | Investment Platform",
  description:

    "Premier investment platform with advanced growth strategies and secure returns. Dollar Growth - Where your investments multiply.",
  keywords: "crypto, investment, dollar growth, finance, growth platform, dollarorgrows",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`} suppressHydrationWarning>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            theme="light"
            position="top-right"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
