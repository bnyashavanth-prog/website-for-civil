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
      let query = supabase.from('bookings').select('*, customer:user_profiles!customer_id(first_name, last_name, phone)').eq('tenant_id', TENANT_ID).order('created_at', { ascending: false })
      if (filter !== 'all') query = query.eq('status', filter)
      const { data } = await query
      setBookings(data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [filter])

  const updateBookingStatus = async (id: string, status: string, price?: string) => {
    const updateData: any = { status }
    if (price !== undefined) updateData.estimated_price = price ? parseFloat(price) : null
    await supabase.from('bookings').update(updateData).eq('id', id).eq('tenant_id', TENANT_ID)
    fetchBookings()
  }

  const getStatusPill = (status: string) => {
    const map: Record<string, string> = { pending: 'status-warning', confirmed: 'status-blue', in_progress: 'status-warning', delivered: 'status-success', cancelled: 'status-danger' }
    return <span className={`status-pill ${map[status] || 'status-warning'}`}>{status.replace('_', ' ')}</span>
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
      <h1 style={{ fontSize: '1.375rem', marginBottom: '1.5rem' }}>Bookings</h1>

      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
            padding: '0.625rem 1rem', background: 'none', border: 'none',
            borderBottom: filter === tab.id ? '2px solid #4C6EF5' : '2px solid transparent',
            color: filter === tab.id ? '#EDEFF2' : '#5F6A78',
            fontWeight: '600', cursor: 'pointer', fontSize: '0.8125rem', transition: 'all 0.15s ease-out'
          }}>{tab.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 size={28} color="#4C6EF5" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#5F6A78', fontSize: '0.8125rem' }}>No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['ID', 'CUSTOMER', 'LOCATION', 'QTY', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', fontWeight: '600', color: '#5F6A78', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'ACTIONS' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="number-font" style={{ padding: '0.75rem 1.25rem', color: '#E8955E' }}>{b.id.substring(0, 8)}</td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <div>{b.customer?.[0]?.first_name || '—'} {b.customer?.[0]?.last_name || ''}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#5F6A78' }}>{b.customer?.[0]?.phone || ''}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', color: '#8D97A5' }}>{b.delivery_location || '—'}</td>
                  <td className="number-font" style={{ padding: '0.75rem 1.25rem' }}>{b.quantity || '—'}</td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>{getStatusPill(b.status)}</td>
                  <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                    {b.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <input type="number" placeholder="₹" className="input" value={prices[b.id] || ''}
                          onChange={(e) => setPrices(prev => ({...prev, [b.id]: e.target.value}))}
                          style={{ width: '90px', padding: '0.375rem 0.625rem', fontSize: '0.75rem' }} />
                        <button onClick={() => updateBookingStatus(b.id, 'confirmed', prices[b.id])}
                          style={{ padding: '0.375rem 0.625rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '6px', backgroundColor: 'rgba(52, 211, 153, 0.12)', color: '#34D399', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.6875rem' }}>
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => updateBookingStatus(b.id, 'cancelled')}
                          style={{ padding: '0.375rem 0.625rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '6px', backgroundColor: 'rgba(248, 113, 113, 0.12)', color: '#F87171', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.6875rem' }}>
                          <X size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="number-font" style={{ fontWeight: '600' }}>{b.estimated_price ? `₹${Number(b.estimated_price).toLocaleString()}` : '—'}</span>
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
