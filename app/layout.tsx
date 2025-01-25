import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TikTok Clone",
  description: "A TikTok clone built with Next.js and shadcn/ui",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SidebarProvider>
            <div className="flex min-h-screen">
              {/* Sidebar */}
              <div className="fixed left-0 top-0 z-40 h-full w-[var(--sidebar-width)] flex-shrink-0">
                <AppSidebar />
              </div>
              
              {/* Main Content */}
              <main className="flex-1 ml-[var(--sidebar-width)]">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

