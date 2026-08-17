"use client";
import { useState } from "react";
import { Plus, Edit2, ToggleLeft, ToggleRight } from "lucide-react";

export default function MaterialsPage() {
  const [categories] = useState([
    { id: '1', name: 'Sand', subcategories: 3, isActive: true },
    { id: '2', name: 'Stone (Aggregate)', subcategories: 4, isActive: true },
    { id: '3', name: 'Tar', subcategories: 1, isActive: false }
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Material Categories</h1>
        <button className="btn btn-primary"><Plus size={18} style={{ marginRight: '0.5rem' }}/> New Category</button>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'gray' }}>Name</th>
              <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'gray' }}>Subcategories</th>
              <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'gray' }}>Status</th>
              <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'gray', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0', fontWeight: '500' }}>{cat.name}</td>
                <td>{cat.subcategories}</td>
                <td>
                  {cat.isActive ? (
                     <span style={{ display: 'inline-flex', alignItems: 'center', color: '#16a34a', fontSize: '0.875rem' }}>
                       <ToggleRight size={18} style={{ marginRight: '0.25rem' }}/> Active
                     </span>
                  ) : (
                     <span style={{ display: 'inline-flex', alignItems: 'center', color: 'gray', fontSize: '0.875rem' }}>
                       <ToggleLeft size={18} style={{ marginRight: '0.25rem' }}/> Inactive
                     </span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}><Edit2 size={14} style={{ marginRight: '0.25rem' }} /> Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
