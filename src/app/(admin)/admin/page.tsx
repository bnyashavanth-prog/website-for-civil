"use client"
import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Activity, Clock, Truck, DollarSign, Loader2 } from 'lucide-react'

const TENANT_ID = '00000000-0000-0000-0000-000000000001'

export default function AdminDashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeTrips: 0,
    pendingBookings: 0,
    availableTrucks: 0,
    totalTrucks: 0,
    todayRevenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        const { count: activeTripsCount } = await supabase
          .from('trips')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', TENANT_ID)
          .in('status', ['assigned', 'en_route', 'arrived'])

        const { count: pendingBookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', TENANT_ID)
          .eq('status', 'pending')

        const { count: totalTrucksCount } = await supabase
          .from('trucks')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', TENANT_ID)
          
        const { count: availableTrucksCount } = await supabase
          .from('trucks')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', TENANT_ID)
          .eq('status', 'available')

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const { data: revenueData } = await supabase
          .from('bookings')
          .select('estimated_price')
          .eq('tenant_id', TENANT_ID)
          .eq('status', 'delivered')
          .gte('created_at', today.toISOString())
          
        const revenue = revenueData?.reduce((sum, item) => sum + (Number(item.estimated_price) || 0), 0) || 0

        const { data: recent } = await supabase
          .from('bookings')
          .select('*, customer:user_profiles!customer_id(first_name, last_name)')
          .eq('tenant_id', TENANT_ID)
          .order('created_at', { ascending: false })
          .limit(5)

        setStats({
          activeTrips: activeTripsCount || 0,
          pendingBookings: pendingBookingsCount || 0,
          availableTrucks: availableTrucksCount || 0,
          totalTrucks: totalTrucksCount || 0,
          todayRevenue: revenue,
        })
        setRecentBookings(recent || [])

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader2 size={32} color="var(--accent-amber)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const getStatusPill = (status: string) => {
    const map: Record<string, string> = {
      pending: 'status-warning',
      confirmed: 'status-teal',
      in_progress: 'status-warning',
      delivered: 'status-success',
      cancelled: 'status-danger',
    }
    return <span className={`status-pill ${map[status] || 'status-warning'}`}>{status}</span>
  }

  const statCards = [
    { title: 'Active trips', value: stats.activeTrips, icon: Activity, color: 'var(--accent-teal)' },
    { title: 'Pending bookings', value: stats.pendingBookings, icon: Clock, color: 'var(--status-warning)' },
    { title: 'Available trucks', value: `${stats.availableTrucks}/${stats.totalTrucks}`, icon: Truck, color: 'var(--accent-terracotta)' },
    { title: "Today's revenue", value: `₹${stats.todayRevenue.toFixed(0)}`, icon: DollarSign, color: 'var(--status-success)' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '2rem' }}>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{stat.title}</p>
                <h3 className="number-font" style={{ fontSize: '1.5rem', fontWeight: '500' }}>{stat.value}</h3>
              </div>
              <div style={{ padding: '0.625rem', backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-btn)' }}>
                <Icon size={18} color={stat.color} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Recent bookings</h2>
        
        {recentBookings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontSize: '0.875rem' }}>No bookings yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid var(--border-hairline)' }}>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '0.5px solid var(--border-hairline)' }}>
                  <td className="number-font" style={{ padding: '0.75rem 0', color: 'var(--amber-text)' }}>{booking.id.substring(0, 8)}</td>
                  <td style={{ padding: '0.75rem 0' }}>{booking.customer?.[0]?.first_name || '—'} {booking.customer?.[0]?.last_name || ''}</td>
                  <td className="number-font" style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem 0' }}>{getStatusPill(booking.status)}</td>
                  <td className="number-font" style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    {booking.estimated_price ? `₹${Number(booking.estimated_price).toFixed(0)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
