"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Users, Plus, Edit, Trash2, X, Check } from "lucide-react";

export default function TenantsManagement() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('active');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setTenants(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update
      const { error } = await supabase
        .from('tenants')
        .update({ name, slug, status })
        .eq('id', editingId);
        
      if (!error) {
        resetForm();
        fetchTenants();
      } else {
        alert("Error updating tenant: " + error.message);
      }
    } else {
      // Create
      const { error } = await supabase
        .from('tenants')
        .insert([{ name, slug, status }]);
        
      if (!error) {
        resetForm();
        fetchTenants();
      } else {
        alert("Error creating tenant: " + error.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);
        
      if (!error) {
        fetchTenants();
      } else {
        alert("Error deleting tenant: " + error.message);
      }
    }
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setStatus('active');
    setEditingId(null);
    setShowForm(false);
  };

  const editTenant = (tenant: any) => {
    setName(tenant.name);
    setSlug(tenant.slug);
    setStatus(tenant.status);
    setEditingId(tenant.id);
    setShowForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={24} /> Tenants Management
        </h1>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn btn-accent" 
          style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} /> New Tenant
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{editingId ? 'Edit Tenant' : 'Create New Tenant'}</h2>
            <button onClick={resetForm} className="btn" style={{ padding: '0.25rem' }}><X size={20} /></button>
          </div>
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Company Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '4px', color: '#f8fafc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Slug</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '4px', color: '#f8fafc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Status</label>
                <select 
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '4px', color: '#f8fafc' }}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="trial">Trial</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" onClick={resetForm} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} /> Save Tenant
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
        {loading ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>Loading tenants...</p>
        ) : tenants.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>No tenants found. Create one to get started.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: '#94a3b8' }}>Company Name</th>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: '#94a3b8' }}>Slug</th>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: '#94a3b8' }}>Status</th>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: '#94a3b8' }}>Created At</th>
                <th style={{ padding: '0.75rem 0', fontWeight: '500', color: '#94a3b8', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '1rem 0', fontWeight: '500' }}>{t.name}</td>
                  <td style={{ color: '#94a3b8' }}>{t.slug}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      backgroundColor: t.status === 'active' ? 'rgba(22, 163, 74, 0.2)' : t.status === 'trial' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                      color: t.status === 'active' ? '#4ade80' : t.status === 'trial' ? '#facc15' : '#f87171', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem' 
                    }}>
                      {t.status ? t.status.toUpperCase() : 'UNKNOWN'}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => editTenant(t)} className="btn" style={{ padding: '0.4rem', color: '#60a5fa' }} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="btn" style={{ padding: '0.4rem', color: '#ef4444' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
