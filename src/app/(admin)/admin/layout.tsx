"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, CalendarDays, Truck, Layers, Image as ImageIcon, LogOut, Radio, Sun, Moon } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useTheme } from '@/components/ThemeProvider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin-login')
  }

  const navItems = [
    { name: 'Command Center', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Fleet Map', href: '/admin/fleet', icon: Truck },
    { name: 'Materials', href: '/admin/categories', icon: Layers },
    { name: 'Site Media', href: '/admin/media', icon: ImageIcon },
  ]

  // Fig 2 colors — adapt for light mode
  const bg       = isLight ? '#F1F5F9' : '#0B0E13'
  const sidebar   = isLight ? '#FFFFFF' : '#12161D'
  const border    = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'
  const logoText  = isLight ? '#1E293B' : '#EDEFF2'
  const logoSub   = isLight ? '#64748B' : '#5F6A78'
  const navActive = isLight ? '#EFF2FF' : '#182029'
  const navText   = isLight ? '#1E293B' : '#EDEFF2'
  const navMuted  = isLight ? '#64748B' : '#8D97A5'
  const navIcon   = isLight ? '#4C6EF5' : '#4C6EF5'
  const navIconM  = isLight ? '#94A3B8' : '#5F6A78'

  return (
    <div className="theme-fig2" style={{ display: 'flex', minHeight: '100vh', backgroundColor: bg, transition: 'background-color 0.2s ease' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        backgroundColor: sidebar,
        borderRight: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.2s ease'
      }}>
        {/* Logo block */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(76,110,245,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={16} color="#4C6EF5" />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: logoText }}> SS Build</div>
            <div style={{ fontSize: '0.6875rem', color: logoSub, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Ops Center</div>
          </div>
        </div>
        
        {/* Nav items */}
        <nav style={{ padding: '0.75rem', flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link href={item.href} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    color: isActive ? navText : navMuted,
                    backgroundColor: isActive ? navActive : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.8125rem',
                    transition: 'all 0.15s ease-out'
                  }}>
                    <Icon size={18} color={isActive ? navIcon : navIconM} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout + Theme toggle at bottom */}
        <div style={{ padding: '0.75rem', borderTop: `1px solid ${border}`, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.875rem', width: '100%', borderRadius: '8px',
              border: 'none', backgroundColor: 'transparent',
              color: navMuted, cursor: 'pointer',
              fontWeight: 500, fontSize: '0.8125rem',
              transition: 'all 0.15s ease-out'
            }}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
            {isLight ? 'Dark Mode' : 'Light Mode'}
          </button>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.875rem', width: '100%', borderRadius: '8px',
              border: 'none', backgroundColor: 'transparent',
              color: navMuted, cursor: 'pointer',
              textAlign: 'left', fontWeight: 500, fontSize: '0.8125rem',
              transition: 'all 0.15s ease-out'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', backgroundColor: bg, transition: 'background-color 0.2s ease' }}>
        {children}
      </main>
    </div>
  )
}
