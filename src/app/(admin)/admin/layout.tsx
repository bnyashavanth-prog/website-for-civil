"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, CalendarDays, Truck, Layers, Image as ImageIcon, LogOut, Radio } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
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

  return (
    <div className="theme-fig2" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0B0E13' }}>
      {/* Sidebar — elevated surface */}
      <aside style={{
        width: '240px',
        backgroundColor: '#12161D',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo block */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(76, 110, 245, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={16} color="#4C6EF5" />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#EDEFF2' }}>SS Build</div>
            <div style={{ fontSize: '0.6875rem', color: '#5F6A78', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Ops Center</div>
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
                    color: isActive ? '#EDEFF2' : '#8D97A5',
                    backgroundColor: isActive ? '#182029' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.8125rem',
                    transition: 'all 0.15s ease-out'
                  }}>
                    <Icon size={18} color={isActive ? '#4C6EF5' : '#5F6A78'} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.875rem',
              width: '100%',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#5F6A78',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 500,
              fontSize: '0.8125rem',
              transition: 'all 0.15s ease-out'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', backgroundColor: '#0B0E13' }}>
        {children}
      </main>
    </div>
  )
}
