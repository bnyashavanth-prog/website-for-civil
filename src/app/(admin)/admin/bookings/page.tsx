"use client"
import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, Check, X, Copy } from 'lucide-react'

const TENANT_ID = '00000000-0000-0000-0000-000000000001'

// Generate a human-readable tracking number: SSB-YYYYMMDD-XXXX
function generateTrackingNumber(): string {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SSB-${date}-${rand}`
}

export default function BookingsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [trackNums, setTrackNums] = useState<Record<string, string>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('bookings')
        .select('*, customer:user_profiles!customer_id(first_name, last_name, phone)')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false })
      if (filter !== 'all') query = query.eq('status', filter)
      const { data } = await query
      setBookings(data || [])

      // Pre-fill tracking number fields for pending bookings
      const initial: Record<string, string> = {}
      data?.forEach((b: any) => {
        if (b.status === 'pending') initial[b.id] = generateTrackingNumber()
      })
      setTrackNums(initial)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [filter])

  const handleApprove = async (id: string) => {
    const price = prices[id]
    const tracking = trackNums[id] || generateTrackingNumber()
    const updateData: any = {
      status: 'confirmed',
      tracking_number: tracking,
    }
    if (price) updateData.estimated_price = parseFloat(price)
    await supabase.from('bookings').update(updateData).eq('id', id).eq('tenant_id', TENANT_ID)
    fetchBookings()
  }

  const handleReject = async (id: string) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id).eq('tenant_id', TENANT_ID)
    fetchBookings()
  }

  const copyTracking = (tn: string, id: string) => {
    navigator.clipboard.writeText(tn)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusPill = (status: string) => {
    const map: Record<string, string> = {
      pending: 'status-warning',
      confirmed: 'status-blue',
      in_progress: 'status-warning',
      delivered: 'status-success',
      cancelled: 'status-danger'
    }
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
            color: filter === tab.id ? 'var(--text-primary)' : '#5F6A78',
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
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['ID', 'CUSTOMER', 'LOCATION', 'QTY', 'TRACKING NO.', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', fontWeight: '600', color: '#5F6A78', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', textAlign: h === 'ACTIONS' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {/* ID */}
                  <td className="number-font" style={{ padding: '0.75rem 1.25rem', color: '#E8955E', whiteSpace: 'nowrap' }}>{b.id.substring(0, 8)}</td>

                  {/* Customer */}
                  <td style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}>
                    <div>{b.customer?.[0]?.first_name || '—'} {b.customer?.[0]?.last_name || ''}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#5F6A78' }}>{b.customer?.[0]?.phone || ''}</div>
                  </td>

                  {/* Location */}
                  <td style={{ padding: '0.75rem 1.25rem', color: '#8D97A5', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.delivery_location || '—'}</td>

                  {/* Qty */}
                  <td className="number-font" style={{ padding: '0.75rem 1.25rem' }}>{b.quantity || '—'}</td>

                  {/* Tracking Number */}
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    {b.tracking_number ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="number-font" style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4C6EF5', letterSpacing: '0.03em' }}>{b.tracking_number}</span>
                        <button
                          onClick={() => copyTracking(b.tracking_number, b.id)}
                          title="Copy tracking number"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === b.id ? '#34D399' : '#5F6A78', padding: '2px' }}
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#5F6A78', fontSize: '0.75rem' }}>—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '0.75rem 1.25rem' }}>{getStatusPill(b.status)}</td>

                  {/* Actions */}
                  <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                    {b.status === 'pending' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                        {/* Price + Tracking inputs */}
                        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                          <input
                            type="number"
                            placeholder="₹ Price"
                            className="input"
                            value={prices[b.id] || ''}
                            onChange={(e) => setPrices(prev => ({...prev, [b.id]: e.target.value}))}
                            style={{ width: '80px', padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                          />
                          <input
                            type="text"
                            placeholder="Track #"
                            className="input"
                            value={trackNums[b.id] || ''}
                            onChange={(e) => setTrackNums(prev => ({...prev, [b.id]: e.target.value}))}
                            style={{ width: '130px', padding: '0.3rem 0.5rem', fontSize: '0.6875rem', fontFamily: 'monospace' }}
                          />
                        </div>
                        {/* Approve / Reject buttons */}
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button
                            onClick={() => handleApprove(b.id)}
                            style={{ padding: '0.35rem 0.625rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '6px', backgroundColor: 'rgba(52, 211, 153, 0.12)', color: '#34D399', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.6875rem' }}
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(b.id)}
                            style={{ padding: '0.35rem 0.625rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '6px', backgroundColor: 'rgba(248, 113, 113, 0.12)', color: '#F87171', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.6875rem' }}
                          >
                            <X size={13} /> Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="number-font" style={{ fontWeight: '600' }}>
                        {b.estimated_price ? `₹${Number(b.estimated_price).toLocaleString()}` : '—'}
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
