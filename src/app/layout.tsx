import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarTrigger } from "@/components/sidebar/siderbar-trigger";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner"
import { ChatInput } from "@/components/chat/chat-input";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "p12o.chat",
  description: "p12o.chat is a chatbot that can help you with your questions.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1 relative flex flex-col min-h-screen min-w-0">

                <SidebarTrigger />

                <div className="flex-1 min-w-0">
                  {children}
                </div>

                <ChatInput />

                <Toaster />
              </main>
            </SidebarProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
      <Script src="/proxy.js"  />
    </html>
  );
}
