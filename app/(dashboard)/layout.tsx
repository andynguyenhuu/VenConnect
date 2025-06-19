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
    <div className="app-container flex h-screen overflow-hidden">
      {/* Desktop Sidebar - Dynamic width handled by the Sidebar component itself */}
      <aside className="sidebar hidden lg:flex lg:flex-col lg:flex-shrink-0 border-r">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header user={user} />
        <main className="main-background flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
