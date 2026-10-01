import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Inter } from 'next/font/google'
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ weight: ["200","300","400","500","600","700","800"], subsets: ['latin'] })

export const metadata: Metadata = {
  title: "S3 UI - Multi-Provider Storage Manager",
  description:
    "Simple UI for S3-compatible storage - AWS S3, MinIO, Cloudflare R2, Supabase, and more.",
  icons: "logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${inter.className} antialiased scroll-smooth `}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
             <Toaster closeButton={true} richColors position="top-center" />
        {children}
            </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
