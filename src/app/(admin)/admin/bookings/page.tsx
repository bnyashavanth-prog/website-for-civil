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

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .eq('tenant_id', TENANT_ID)
      
      fetchBookings()
    } catch (error) {
      console.error("Error updating booking:", error)
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Bookings Management</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '0.75rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: filter === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: filter === tab.id ? 'var(--primary)' : 'inherit',
              fontWeight: filter === tab.id ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>No bookings found for this filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>ID: {booking.id.substring(0, 8)}</span>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    backgroundColor: 'var(--accent)',
                    color: 'white'
                  }}>
                    {booking.status}
                  </span>
                </div>
                <p style={{ marginBottom: '0.25rem' }}>
                  <strong>Customer:</strong> {booking.customer?.[0]?.first_name} {booking.customer?.[0]?.last_name} ({booking.customer?.[0]?.phone})
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                  Location: {booking.delivery_location} | Qty: {booking.quantity}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {booking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius)', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      <Check size={16} /> Approve
                    </button>
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="btn btn-outline"
                      style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius)', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', cursor: 'pointer' }}
                    >
                      <X size={16} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
