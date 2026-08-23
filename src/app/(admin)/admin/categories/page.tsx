"use client"
import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Plus, Loader2, Edit2, Check } from 'lucide-react'

const TENANT_ID = '00000000-0000-0000-0000-000000000001'

export default function CategoriesPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const fetchCategories = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').eq('tenant_id', TENANT_ID).order('display_order', { ascending: true })
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    await supabase.from('categories').insert([{ name: newCatName, tenant_id: TENANT_ID, is_active: true, display_order: categories.length }])
    setShowAdd(false); setNewCatName(''); fetchCategories()
  }

  const handleUpdateCategory = async (id: string) => {
    await supabase.from('categories').update({ name: editName }).eq('id', id).eq('tenant_id', TENANT_ID)
    setEditingId(null); fetchCategories()
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('categories').update({ is_active: !currentStatus }).eq('id', id).eq('tenant_id', TENANT_ID)
    fetchCategories()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem' }}>Materials</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem', borderRadius: '8px', backgroundColor: '#CC6A2E', color: '#241000', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.8125rem' }}>
          <Plus size={16} /> New Category
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.8125rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>Add category</h2>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.75rem' }}>
            <input type="text" placeholder="Category name (e.g. Aggregate)" required className="input" value={newCatName} onChange={e => setNewCatName(e.target.value)} style={{ flex: 1 }} />
            <button type="submit" style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', backgroundColor: '#CC6A2E', color: '#241000', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.8125rem' }}>Save</button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} color="#4C6EF5" style={{ animation: 'spin 1s linear infinite' }} /></div>
      ) : categories.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}><p style={{ color: '#5F6A78', fontSize: '0.8125rem' }}>No categories yet. Create one to organize materials.</p></div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['CATEGORY', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', fontWeight: '600', color: '#5F6A78', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'ACTIONS' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: cat.is_active ? 1 : 0.55 }}>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    {editingId === cat.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="text" className="input" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '200px', padding: '0.375rem 0.625rem' }} />
                        <button onClick={() => handleUpdateCategory(cat.id)} style={{ padding: '0.375rem', backgroundColor: 'rgba(52, 211, 153, 0.12)', color: '#34D399', borderRadius: '6px', border: 'none', cursor: 'pointer' }}><Check size={14} /></button>
                      </div>
                    ) : (
                      <span style={{ fontWeight: '600' }}>{cat.name}</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <span className={`status-pill ${cat.is_active ? 'status-success' : 'status-danger'}`} style={{ cursor: 'pointer' }} onClick={() => toggleStatus(cat.id, cat.is_active)}>
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                    <button onClick={() => { setEditingId(cat.id); setEditName(cat.name) }} style={{ background: 'none', border: 'none', color: '#5F6A78', cursor: 'pointer', padding: '0.25rem' }}><Edit2 size={14} /></button>
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
