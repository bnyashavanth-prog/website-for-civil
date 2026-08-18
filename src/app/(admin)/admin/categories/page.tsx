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
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .order('display_order', { ascending: true })
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    
    try {
      await supabase
        .from('categories')
        .insert([{ 
          name: newCatName, 
          tenant_id: TENANT_ID,
          is_active: true,
          display_order: categories.length
        }])
      
      setShowAdd(false)
      setNewCatName('')
      fetchCategories()
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  const handleUpdateCategory = async (id: string) => {
    try {
      await supabase
        .from('categories')
        .update({ name: editName })
        .eq('id', id)
        .eq('tenant_id', TENANT_ID)
      
      setEditingId(null)
      fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id)
        .eq('tenant_id', TENANT_ID)
      
      fetchCategories()
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '500' }}>Materials</h1>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Add category</h2>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Category name (e.g. Aggregate)"
              required 
              className="input"
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 size={32} color="var(--accent-amber)" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : categories.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No categories found. Create one to organize materials.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid var(--border-hairline)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '0.5px solid var(--border-hairline)', opacity: cat.is_active ? 1 : 0.6 }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {editingId === cat.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          className="input"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          style={{ width: '200px', padding: '0.5rem 0.75rem' }}
                        />
                        <button 
                          onClick={() => handleUpdateCategory(cat.id)}
                          style={{ padding: '0.5rem', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: 'var(--status-success)', borderRadius: 'var(--radius-btn)', border: 'none', cursor: 'pointer' }}
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontWeight: '500' }}>{cat.name}</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span 
                      className={`status-pill ${cat.is_active ? 'status-success' : 'status-danger'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleStatus(cat.id, cat.is_active)}
                    >
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => {
                        setEditingId(cat.id)
                        setEditName(cat.name)
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                    >
                      <Edit2 size={16} />
                    </button>
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
