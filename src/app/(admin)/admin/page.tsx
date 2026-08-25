"use client"
import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Truck, MapPin, Clock, Wrench, Package, DollarSign, Loader2, AlertTriangle } from 'lucide-react'

const TENANT_ID = '00000000-0000-0000-0000-000000000001'

export default function AdminDashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTrucks: 0,
    inTransit: 0,
    available: 0,
    maintenance: 0,
    pendingBookings: 0,
    todayRevenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Trucks
        const { count: totalTrucks } = await supabase.from('trucks').select('*', { count: 'exact', head: true }).eq('tenant_id', TENANT_ID)
        const { count: available } = await supabase.from('trucks').select('*', { count: 'exact', head: true }).eq('tenant_id', TENANT_ID).eq('status', 'available')
        const { count: inTransit } = await supabase.from('trips').select('*', { count: 'exact', head: true }).eq('tenant_id', TENANT_ID).in('status', ['assigned', 'en_route'])
        const { count: maintenance } = await supabase.from('trucks').select('*', { count: 'exact', head: true }).eq('tenant_id', TENANT_ID).eq('status', 'maintenance')

        // Bookings
        const { count: pending } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('tenant_id', TENANT_ID).eq('status', 'pending')

        // Today revenue
        const today = new Date(); today.setHours(0, 0, 0, 0)
        const { data: revData } = await supabase.from('bookings').select('estimated_price').eq('tenant_id', TENANT_ID).eq('status', 'delivered').gte('created_at', today.toISOString())
        const revenue = revData?.reduce((s, i) => s + (Number(i.estimated_price) || 0), 0) || 0

        // Recent bookings
        const { data: recent } = await supabase
          .from('bookings')
          .select('*, customer:user_profiles!customer_id(first_name, last_name)')
          .eq('tenant_id', TENANT_ID)
          .order('created_at', { ascending: false })
          .limit(6)

        setStats({ totalTrucks: totalTrucks || 0, inTransit: inTransit || 0, available: available || 0, maintenance: maintenance || 0, pendingBookings: pending || 0, todayRevenue: revenue })
        setRecentBookings(recent || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 size={32} color="#4C6EF5" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  const getStatusPill = (status: string) => {
    const map: Record<string, string> = { pending: 'status-warning', confirmed: 'status-blue', in_progress: 'status-warning', delivered: 'status-success', cancelled: 'status-danger' }
    return <span className={`status-pill ${map[status] || 'status-warning'}`}>{status.replace('_', ' ')}</span>
  }

  const kpis = [
    { label: 'Total trucks', value: stats.totalTrucks, icon: Truck, color: '#4C6EF5', bg: 'rgba(76, 110, 245, 0.12)' },
    { label: 'In transit', value: stats.inTransit, icon: MapPin, color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.12)' },
    { label: 'Available', value: stats.available, icon: Clock, color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)' },
    { label: 'Maintenance', value: stats.maintenance, icon: Wrench, color: '#F87171', bg: 'rgba(248, 113, 113, 0.12)' },
    { label: 'Pending orders', value: stats.pendingBookings, icon: Package, color: '#E8955E', bg: 'rgba(232, 149, 94, 0.12)' },
    { label: "Today's revenue", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: DollarSign, color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', marginBottom: '0.25rem' }}>Command Center</h1>
          <p style={{ color: '#5F6A78', fontSize: '0.8125rem' }}>Fleet operations overview</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '20px', backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
          <div className="pulse-marker" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22D3EE' }}></div>
          <span style={{ fontSize: '0.75rem', color: '#67E8F9', fontWeight: '600' }}>LIVE</span>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <div key={i} className="card kpi-card">
              <div className="kpi-chip" style={{ backgroundColor: kpi.bg }}>
                <Icon size={18} color={kpi.color} />
              </div>
              <div>
                <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="kpi-label">{kpi.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Two-column: Fleet Map + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Live Fleet Map Placeholder */}
        <div className="card card-live" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '320px', backgroundColor: '#0D1117', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Google Maps Embed with Dark Mode CSS Filter */}
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src="https://maps.google.com/maps?width=100%25&amp;height=100%25&amp;hl=en&amp;q=Bangalore+(SS%20Build)&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
              style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(80%) contrast(120%)', position: 'absolute', inset: 0, zIndex: 0 }}
            ></iframe>
            
            {/* Simulated truck markers overlaid on map */}
            <div className="pulse-marker" style={{ position: 'absolute', top: '35%', left: '30%', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#22D3EE', zIndex: 1, border: '2px solid #0B0E13' }}></div>
            <div className="pulse-marker" style={{ position: 'absolute', top: '55%', left: '55%', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#22D3EE', zIndex: 1, border: '2px solid #0B0E13' }}></div>
            <div style={{ position: 'absolute', top: '45%', left: '70%', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#34D399', zIndex: 1, border: '2px solid #0B0E13' }}></div>
          </div>
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Active routes</span>
            <span className="number-font" style={{ fontSize: '0.875rem', color: '#67E8F9' }}>{stats.inTransit} tracking</span>
          </div>
        </div>

        {/* Fleet Status & Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Fleet Status Donut Placeholder */}
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.8125rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>Fleet Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Available', val: stats.available, color: '#34D399', total: stats.totalTrucks },
                { label: 'In Transit', val: stats.inTransit, color: '#22D3EE', total: stats.totalTrucks },
                { label: 'Maintenance', val: stats.maintenance, color: '#F87171', total: stats.totalTrucks },
              ].map((row, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#8D97A5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: row.color, display: 'inline-block' }}></span>
                      {row.label}
                    </span>
                    <span className="number-font" style={{ fontSize: '0.8125rem', fontWeight: '600' }}>{row.val}<span style={{ color: '#5F6A78', fontWeight: '400' }}> / {row.total}</span></span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: row.total > 0 ? `${(row.val / row.total) * 100}%` : '0%', backgroundColor: row.color, borderRadius: '2px', transition: 'width 0.4s ease-out' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts */}
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.8125rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>Active Alerts</h3>
            {stats.pendingBookings > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(232, 149, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={16} color="#E8955E" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: '600' }}>{stats.pendingBookings} pending booking{stats.pendingBookings > 1 ? 's' : ''}</p>
                  <p style={{ fontSize: '0.75rem', color: '#5F6A78' }}>Awaiting price confirmation</p>
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#5F6A78' }}>now</span>
              </div>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: '#5F6A78' }}>No active alerts</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontSize: '0.8125rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recent Bookings</h3>
        </div>

        {recentBookings.length === 0 ? (
          <p style={{ color: '#5F6A78', textAlign: 'center', padding: '2.5rem', fontSize: '0.8125rem' }}>No bookings recorded yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['ID', 'CUSTOMER', 'TYPE', 'DATE', 'STATUS', 'AMOUNT'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.5rem', fontWeight: '600', color: '#5F6A78', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="number-font" style={{ padding: '0.75rem 1.5rem', color: '#E8955E' }}>{b.id.substring(0, 8)}</td>
                  <td style={{ padding: '0.75rem 1.5rem' }}>{b.customer?.[0]?.first_name || '—'} {b.customer?.[0]?.last_name || ''}</td>
                  <td style={{ padding: '0.75rem 1.5rem', color: '#8D97A5' }}>{b.booking_type || 'material'}</td>
                  <td className="number-font" style={{ padding: '0.75rem 1.5rem', color: '#5F6A78' }}>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem 1.5rem' }}>{getStatusPill(b.status)}</td>
                  <td className="number-font" style={{ padding: '0.75rem 1.5rem' }}>{b.estimated_price ? `₹${Number(b.estimated_price).toLocaleString()}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
