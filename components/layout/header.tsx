'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MobileSidebar } from './sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Globe, User, LogOut, Settings } from 'lucide-react'

interface HeaderProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function Header({ user }: HeaderProps) {
  const [region, setRegion] = useState<'AU' | 'VN'>('AU')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Detect region based on timezone or stored preference
    const storedRegion = localStorage.getItem('region') as 'AU' | 'VN'
    if (storedRegion) {
      setRegion(storedRegion)
    } else {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (timezone.includes('Asia/Ho_Chi_Minh') || timezone.includes('Asia/Saigon')) {
        setRegion('VN')
      }
    }
  }, [])

  const handleRegionChange = (newRegion: 'AU' | 'VN') => {
    setRegion(newRegion)
    localStorage.setItem('region', newRegion)
    document.documentElement.classList.remove('theme-au', 'theme-vn')
    document.documentElement.classList.add(`theme-${newRegion.toLowerCase()}`)
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-theme">
      <div className="flex h-16 items-center px-4 gap-4">
        <MobileSidebar />
        
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:inline-flex">
              Claude 4 Sonnet
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Region Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  {region}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Region</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleRegionChange('AU')}>
                  🇦🇺 Australia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRegionChange('VN')}>
                  🇻🇳 Vietnam
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
