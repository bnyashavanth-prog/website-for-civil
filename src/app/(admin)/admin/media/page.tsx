"use client";
import { useState } from "react";
import { UploadCloud, Image as ImageIcon, Trash2 } from "lucide-react";

export default function SiteMediaPage() {
  const [images, setImages] = useState([
    { id: '1', slot: 'hero_1', url: 'https://images.unsplash.com/photo-1541888081622-2646271c61be?q=80&w=600', uploadedAt: '2024-03-01' },
    { id: '2', slot: 'gallery_1', url: 'https://images.unsplash.com/photo-1587848651817-640a4af10fb8?q=80&w=600', uploadedAt: '2024-03-05' }
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Site Media Management</h1>
        <button className="btn btn-primary"><UploadCloud size={18} style={{ marginRight: '0.5rem' }}/> Upload New Image</button>
      </div>
      
      <p style={{ marginBottom: '2rem', color: 'gray' }}>Manage images used on the public customer portal. Images upload directly to Supabase Storage.</p>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Hero Banners</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          
          {/* Mock Image Card */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <div style={{ height: '150px', backgroundColor: '#e2e8f0', backgroundImage: `url(${images[0].url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>Hero Banner 1</p>
                <p style={{ fontSize: '0.75rem', color: 'gray' }}>{images[0].slot}</p>
              </div>
              <button className="btn btn-outline" style={{ padding: '0.25rem', color: 'red', border: 'none' }}><Trash2 size={16} /></button>
            </div>
          </div>
          
          {/* Empty Slot */}
          <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius)', height: '210px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'gray', cursor: 'pointer' }}>
            <ImageIcon size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.875rem' }}>Add Hero Banner 2</p>
          </div>

        </div>
      </div>
    </div>
  );
}
