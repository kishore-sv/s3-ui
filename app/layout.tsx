import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Inter } from 'next/font/google'

const inter = Inter({ weight: ["200","300","400","500","600","700","800"], subsets: ['latin'] })

export const metadata: Metadata = {
  title: "S3 Ui",
  description: "Simple s3 ui for s3 operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${inter.className} antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
