"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, MessageSquare, Video, BookOpen, Music2, MessageCircle } from "lucide-react"

const menuItems = [
  {
    title: "MANAGE",
    items: [
      {
        label: "Home",
        icon: Home,
        href: "/studio"
      },
      {
        label: "Posts",
        icon: Video,
        href: "/studio/posts"
      },
      {
        label: "Analytics",
        icon: BarChart2,
        href: "/studio/analytics"
      },
      {
        label: "Comments",
        icon: MessageSquare,
        href: "/studio/comments"
      }
    ]
  },
  {
    title: "TOOLS",
    items: [
      {
        label: "Inspirations",
        icon: BookOpen,
        href: "/studio/inspirations"
      },
      {
        label: "Creator Academy",
        icon: Video,
        href: "/studio/academy"
      },
      {
        label: "Unlimited sounds",
        icon: Music2,
        href: "/studio/sounds"
      }
    ]
  },
  {
    title: "OTHERS",
    items: [
      {
        label: "Feedback",
        icon: MessageCircle,
        href: "/studio/feedback"
      }
    ]
  }
]

export function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-60 border-r flex flex-col">
        <div className="p-4 border-b">
          <Link href="/studio" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 725 725"
              className="w-8 h-8"
              fill="currentColor"
            >
              <path d="M652 236c-49-1-95-23-127-60v267c0 157-127 284-284 284S-43 600-43 443 84 159 241 159c10 0 21 1 31 2v138c-10-2-21-3-31-3-92 0-166 74-166 166s74 166 166 166 166-74 166-166V0h142c9 71 64 127 135 137v99z" />
            </svg>
            <span className="font-semibold">TikTok Studio</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="text-xs font-semibold text-muted-foreground mb-2">
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50 text-muted-foreground"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
} 