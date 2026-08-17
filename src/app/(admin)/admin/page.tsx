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
        // Active Trips
        const { count: activeTripsCount } = await supabase
          .from('trips')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', TENANT_ID)
          .in('status', ['assigned', 'en_route', 'arrived'])

        // Pending Bookings
        const { count: pendingBookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', TENANT_ID)
          .eq('status', 'pending')

        // Available Trucks
        const { count: totalTrucksCount } = await supabase
          .from('trucks')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', TENANT_ID)
          
        const { count: availableTrucksCount } = await supabase
          .from('trucks')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', TENANT_ID)
          .eq('status', 'available')

        // Today's Revenue
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const { data: revenueData } = await supabase
          .from('bookings')
          .select('estimated_price')
          .eq('tenant_id', TENANT_ID)
          .eq('status', 'delivered')
          .gte('created_at', today.toISOString())
          
        const revenue = revenueData?.reduce((sum, item) => sum + (Number(item.estimated_price) || 0), 0) || 0

        // Recent Bookings
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
        <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const statCards = [
    { title: 'Active Trips', value: stats.activeTrips, icon: Activity, color: '#3b82f6' },
    { title: 'Pending Bookings', value: stats.pendingBookings, icon: Clock, color: '#f59e0b' },
    { title: 'Available Trucks', value: `${stats.availableTrucks} / ${stats.totalTrucks}`, icon: Truck, color: '#10b981' },
    { title: "Today's Revenue", value: `$${stats.todayRevenue.toFixed(2)}`, icon: DollarSign, color: '#8b5cf6' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{stat.title}</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</h3>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: `${stat.color}20`, borderRadius: '0.5rem', color: stat.color }}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Bookings</h2>
        
        {recentBookings.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>No bookings yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                <th style={{ padding: '1rem 0', fontWeight: '500' }}>ID</th>
                <th style={{ padding: '1rem 0', fontWeight: '500' }}>Customer</th>
                <th style={{ padding: '1rem 0', fontWeight: '500' }}>Date</th>
                <th style={{ padding: '1rem 0', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '1rem 0', fontWeight: '500', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>{booking.id.substring(0, 8)}</td>
                  <td style={{ padding: '1rem 0' }}>{booking.customer?.[0]?.first_name} {booking.customer?.[0]?.last_name}</td>
                  <td style={{ padding: '1rem 0' }}>{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.875rem',
                      backgroundColor: booking.status === 'delivered' ? '#10b98120' : '#f59e0b20',
                      color: booking.status === 'delivered' ? '#10b981' : '#f59e0b'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>${Number(booking.estimated_price || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
