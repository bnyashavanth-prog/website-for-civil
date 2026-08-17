"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, CalendarDays, Truck, Layers, Image as ImageIcon, LogOut } from 'lucide-react'
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
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Fleet Map', href: '/admin/fleet', icon: Truck },
    { name: 'Materials', href: '/admin/categories', icon: Layers },
    { name: 'Site Media', href: '/admin/media', icon: ImageIcon },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: 'var(--card)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>SS Build Admin</h1>
        </div>
        
        <nav style={{ padding: '1rem', flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link href={item.href} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius)',
                    textDecoration: 'none',
                    color: isActive ? 'white' : 'inherit',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    fontWeight: isActive ? 500 : 400,
                  }}>
                    <Icon size={20} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              width: '100%',
              borderRadius: 'var(--radius)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
