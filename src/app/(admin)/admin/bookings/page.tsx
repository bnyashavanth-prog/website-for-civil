"use client"
import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, Check, X } from 'lucide-react'

const TENANT_ID = '00000000-0000-0000-0000-000000000001'

export default function BookingsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [prices, setPrices] = useState<Record<string, string>>({})

  const fetchBookings = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('bookings')
        .select('*, customer:user_profiles!customer_id(first_name, last_name, phone)')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data } = await query
      setBookings(data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const updateBookingStatus = async (id: string, status: string, price?: string) => {
    try {
      const updateData: any = { status }
      if (price !== undefined) {
        updateData.estimated_price = price ? parseFloat(price) : null
      }

      await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', TENANT_ID)
      
      fetchBookings()
    } catch (error) {
      console.error("Error updating booking:", error)
    }
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

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '2rem' }}>Bookings</h1>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem', borderBottom: '0.5px solid var(--border-hairline)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '0.75rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: filter === tab.id ? '2px solid var(--accent-amber)' : '2px solid transparent',
              color: filter === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.15s ease-out'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 size={32} color="var(--accent-amber)" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid var(--border-hairline)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Location</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Qty</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '0.5px solid var(--border-hairline)' }}>
                  <td className="number-font" style={{ padding: '1rem 1.5rem', color: 'var(--amber-text)' }}>{booking.id.substring(0, 8)}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div>{booking.customer?.[0]?.first_name || '—'} {booking.customer?.[0]?.last_name || ''}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.customer?.[0]?.phone || ''}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{booking.delivery_location || '—'}</td>
                  <td className="number-font" style={{ padding: '1rem 0.5rem' }}>{booking.quantity || '—'}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{getStatusPill(booking.status)}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    {booking.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <input 
                          type="number" 
                          placeholder="₹ Price" 
                          className="input" 
                          value={prices[booking.id] || ''} 
                          onChange={(e) => setPrices(prev => ({...prev, [booking.id]: e.target.value}))}
                          style={{ width: '100px', padding: '0.5rem 0.75rem' }}
                        />
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'confirmed', prices[booking.id])}
                          style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: 'var(--radius-btn)', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: 'var(--status-success)', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '0.75rem' }}
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: 'var(--radius-btn)', backgroundColor: 'rgba(248, 113, 113, 0.15)', color: 'var(--status-danger)', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '0.75rem' }}
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="number-font" style={{ fontWeight: '500' }}>
                        {booking.estimated_price ? `₹${booking.estimated_price}` : '—'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
