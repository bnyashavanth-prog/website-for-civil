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
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Materials & Categories</h1>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius)', backgroundColor: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={20} /> New Category
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Category</h2>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Category Name (e.g. Aggregate)"
              required 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'inherit' }}
            />
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
      ) : categories.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>No categories found. Create one to organize materials.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {categories.map(cat => (
            <div key={cat.id} className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {editingId === cat.id ? (
                <div style={{ display: 'flex', gap: '1rem', flex: 1, marginRight: '2rem' }}>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'inherit' }}
                  />
                  <button 
                    onClick={() => handleUpdateCategory(cat.id)}
                    style={{ padding: '0.5rem', backgroundColor: '#10b981', color: 'white', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer' }}
                  >
                    <Check size={20} />
                  </button>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{cat.name}</h3>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '999px', 
                  fontSize: '0.875rem',
                  backgroundColor: cat.is_active ? '#10b98120' : '#ef444420',
                  color: cat.is_active ? '#10b981' : '#ef4444',
                  cursor: 'pointer'
                }} onClick={() => toggleStatus(cat.id, cat.is_active)}>
                  {cat.is_active ? 'Active' : 'Inactive'}
                </span>
                
                <button 
                  onClick={() => {
                    setEditingId(cat.id)
                    setEditName(cat.name)
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
