'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock user data - replace with actual auth data
  const user = {
    name: 'Andy Nguyen',
    email: 'andy@ven.com.au',
    avatar: undefined,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar - Dynamic width handled by the Sidebar component itself */}
      <aside className="hidden lg:flex lg:flex-col lg:flex-shrink-0 border-r bg-card">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header user={user} />
        <main className="flex-1 overflow-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
