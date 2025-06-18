'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Menu,
  ChevronLeft,
  Globe
} from 'lucide-react'

const sidebarItems = [
  {
    title: 'Chat',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    title: 'Admin',
    href: '/admin',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      'sidebar relative flex h-full flex-col transition-all duration-300 ease-in-out', 
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      <div className="flex h-16 items-center justify-between border-b px-4 transition-theme">
        <Link href="/" className="flex items-center space-x-2 min-w-0">
          <Globe className="h-6 w-6 text-primary flex-shrink-0" />
          <span className={cn(
            "font-semibold whitespace-nowrap transition-opacity duration-200",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            VenConnect
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex flex-shrink-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform duration-200', collapsed && 'rotate-180')} />
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {sidebarItems.map((item) => (
            <div key={item.href} className="relative group">
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full transition-all duration-200 sidebar-nav-item',
                  collapsed ? 'justify-center px-2' : 'justify-start',
                  pathname === item.href && 'active'
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className={cn('h-4 w-4 flex-shrink-0', !collapsed && 'mr-2')} />
                  <span className={cn(
                    "whitespace-nowrap transition-opacity duration-200",
                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  )}>
                    {item.title}
                  </span>
                </Link>
              </Button>
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
