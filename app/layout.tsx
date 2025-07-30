import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Inter } from 'next/font/google'
import { Toaster } from "sonner";

const inter = Inter({ weight: ["200","300","400","500","600","700","800"], subsets: ['latin'] })

export const metadata: Metadata = {
  title: "AWS S3 Ui",
  description: "Simple s3 ui for s3 CURD operations on s3",
  icons:'logo.svg'
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
             <Toaster richColors position="top-center" />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
