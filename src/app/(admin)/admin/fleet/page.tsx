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
  const [newTruck, setNewTruck] = useState({ registration_number: '', capacity_type: '10 Ton', status: 'available' })

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
      setNewTruck({ registration_number: '', capacity_type: '10 Ton', status: 'available' })
      fetchTrucks()
    } catch (error) {
      console.error("Error adding truck:", error)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Fleet Management</h1>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius)', backgroundColor: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={20} /> Add Truck
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Truck</h2>
          <form onSubmit={handleAddTruck} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Registration Number</label>
              <input 
                type="text" 
                required 
                value={newTruck.registration_number}
                onChange={e => setNewTruck({...newTruck, registration_number: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'inherit' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Capacity</label>
              <select 
                value={newTruck.capacity_type}
                onChange={e => setNewTruck({...newTruck, capacity_type: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'inherit' }}
              >
                <option value="10 Ton">10 Ton</option>
                <option value="20 Ton">20 Ton</option>
                <option value="Trailer">Trailer</option>
              </select>
            </div>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              Save
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : trucks.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <Truck size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>No trucks in your fleet yet. Add one to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {trucks.map(truck => (
            <div key={truck.id} className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '0.5rem' }}>
                    <Truck size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{truck.registration_number}</h3>
                </div>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '999px', 
                  fontSize: '0.875rem',
                  backgroundColor: truck.status === 'available' ? '#10b98120' : truck.status === 'maintenance' ? '#ef444420' : '#f59e0b20',
                  color: truck.status === 'available' ? '#10b981' : truck.status === 'maintenance' ? '#ef4444' : '#f59e0b',
                  textTransform: 'capitalize'
                }}>
                  {truck.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.875rem' }}>
                <span>Capacity: {truck.capacity_type}</span>
                <span>Added: {new Date(truck.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
