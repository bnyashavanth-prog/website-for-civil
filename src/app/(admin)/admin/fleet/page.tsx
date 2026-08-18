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
    try {
      const { data } = await supabase
        .from('trucks')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false })
      setTrucks(data || [])
    } catch (error) {
      console.error("Error fetching trucks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrucks()
  }, [])

  const handleAddTruck = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await supabase
        .from('trucks')
        .insert([{ ...newTruck, tenant_id: TENANT_ID }])
      
      setShowAdd(false)
      setNewTruck({ registration_number: '', capacity_type: '10 Wheel', status: 'available' })
      fetchTrucks()
    } catch (error) {
      console.error("Error adding truck:", error)
    }
  }

  const getTruckStatusPill = (status: string) => {
    const map: Record<string, string> = {
      available: 'status-success',
      in_transit: 'status-teal',
      maintenance: 'status-danger',
      offline: 'status-warning',
    }
    return <span className={`status-pill ${map[status] || 'status-warning'}`}>{status}</span>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '500' }}>Fleet</h1>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} /> Add Truck
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-secondary)' }}>New truck</h2>
          <form onSubmit={handleAddTruck} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registration number</label>
              <input 
                type="text" 
                required 
                className="input"
                placeholder="e.g. KA-01-AB-1234"
                value={newTruck.registration_number}
                onChange={e => setNewTruck({...newTruck, registration_number: e.target.value})}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capacity</label>
              <select 
                className="input"
                value={newTruck.capacity_type}
                onChange={e => setNewTruck({...newTruck, capacity_type: e.target.value})}
              >
                <option value="10 Wheel">10 Wheel</option>
                <option value="14 Wheel">14 Wheel</option>
                <option value="16 Wheel">16 Wheel</option>
                <option value="Trailer">Trailer</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 size={32} color="var(--accent-amber)" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : trucks.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Truck size={32} style={{ margin: '0 auto 1rem auto', color: 'var(--text-muted)', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No trucks registered. Add one to get started.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid var(--border-hairline)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Registration</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Capacity</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Added</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map(truck => (
                <tr key={truck.id} style={{ borderBottom: '0.5px solid var(--border-hairline)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.5rem', backgroundColor: 'rgba(193, 68, 14, 0.1)', borderRadius: 'var(--radius-btn)' }}>
                        <Truck size={16} color="var(--accent-terracotta)" />
                      </div>
                      <span style={{ fontWeight: '500' }}>{truck.registration_number}</span>
                    </div>
                  </td>
                  <td className="number-font" style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{truck.capacity_type}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{getTruckStatusPill(truck.status)}</td>
                  <td className="number-font" style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)' }}>{new Date(truck.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
