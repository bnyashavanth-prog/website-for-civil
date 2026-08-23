"use client"
import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Truck, Plus, Loader2 } from 'lucide-react'

const TENANT_ID = '00000000-0000-0000-0000-000000000001'

export default function FleetPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(true)
  const [trucks, setTrucks] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newTruck, setNewTruck] = useState({ registration_number: '', capacity_type: '10 Wheel', status: 'available' })

  const fetchTrucks = async () => {
    setLoading(true)
    const { data } = await supabase.from('trucks').select('*').eq('tenant_id', TENANT_ID).order('created_at', { ascending: false })
    setTrucks(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchTrucks() }, [])

  const handleAddTruck = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('trucks').insert([{ ...newTruck, tenant_id: TENANT_ID }])
    setShowAdd(false)
    setNewTruck({ registration_number: '', capacity_type: '10 Wheel', status: 'available' })
    fetchTrucks()
  }

  const getTruckPill = (status: string) => {
    const map: Record<string, string> = { available: 'status-success', in_transit: 'status-teal', maintenance: 'status-danger', offline: 'status-warning' }
    return <span className={`status-pill ${map[status] || 'status-warning'}`}>{status}</span>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem' }}>Fleet</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem', borderRadius: '8px', backgroundColor: '#CC6A2E', color: '#241000', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.8125rem' }}>
          <Plus size={16} /> Add Truck
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.8125rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>New vehicle</h2>
          <form onSubmit={handleAddTruck} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.6875rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Registration</label>
              <input type="text" required className="input" placeholder="KA-01-AB-1234" value={newTruck.registration_number} onChange={e => setNewTruck({...newTruck, registration_number: e.target.value})} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.6875rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Capacity</label>
              <select className="input" value={newTruck.capacity_type} onChange={e => setNewTruck({...newTruck, capacity_type: e.target.value})}>
                <option value="10 Wheel">10 Wheel</option>
                <option value="14 Wheel">14 Wheel</option>
                <option value="16 Wheel">16 Wheel</option>
                <option value="Trailer">Trailer</option>
              </select>
            </div>
            <button type="submit" style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', backgroundColor: '#CC6A2E', color: '#241000', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.8125rem' }}>Save</button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 size={28} color="#4C6EF5" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : trucks.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Truck size={28} style={{ margin: '0 auto 0.75rem', color: '#5F6A78', opacity: 0.5 }} />
          <p style={{ color: '#5F6A78', fontSize: '0.8125rem' }}>No trucks registered. Add one to get started.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['VEHICLE', 'CAPACITY', 'STATUS', 'ADDED'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', fontWeight: '600', color: '#5F6A78', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'ADDED' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trucks.map(truck => (
                <tr key={truck.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(76, 110, 245, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Truck size={14} color="#4C6EF5" />
                      </div>
                      <span style={{ fontWeight: '600' }}>{truck.registration_number}</span>
                    </div>
                  </td>
                  <td className="number-font" style={{ padding: '0.75rem 1.25rem', color: '#8D97A5' }}>{truck.capacity_type}</td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>{getTruckPill(truck.status)}</td>
                  <td className="number-font" style={{ padding: '0.75rem 1.25rem', textAlign: 'right', color: '#5F6A78' }}>{new Date(truck.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
