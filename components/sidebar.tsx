"use client"

import { Home, Compass, Users, Upload, Activity, MessageCircle, Video, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserButton, SignInButton, useUser, SignedIn, SignedOut } from "@clerk/nextjs"

const menuItems = [
  {
    label: "For You",
    href: "/",
    icon: Home
  },
  {
    label: "Explore",
    href: "/explore",
    icon: Compass
  },
  {
    label: "Following",
    href: "/following",
    icon: Users
  },
  {
    label: "LIVE",
    href: "/live",
    icon: Video
  }
]

const secondaryItems = [
  {
    label: "Upload",
    href: "/upload",
    icon: Upload
  },
  {
    label: "Activity",
    href: "/activity",
    icon: Activity
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageCircle
  }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-4 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 725 725" className="w-8 h-8" fill="currentColor">
            <path d="M652 236c-49-1-95-23-127-60v267c0 157-127 284-284 284S-43 600-43 443 84 159 241 159c10 0 21 1 31 2v138c-10-2-21-3-31-3-92 0-166 74-166 166s74 166 166 166 166-74 166-166V0h142c9 71 64 127 135 137v99z" />
          </svg>
          <span className="text-xl font-bold">TikTok</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href} className="flex items-center gap-4">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {isLoaded && (
            <SidebarMenuItem>
              {user ? (
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      userButtonBox: "w-full flex items-center gap-4 px-4 py-2"
                    }
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full flex items-center gap-4 px-4 py-2">
                    <User className="w-5 h-5" />
                    <span>Sign in</span>
                  </button>
                </SignInButton>
              )}
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

