"use client"
import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react'

const TENANT_ID = '00000000-0000-0000-0000-000000000001'

export default function MediaPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(true)
  const [mediaItems, setMediaItems] = useState<any[]>([])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('site_media')
        .select('*, categories(name)')
        .eq('tenant_id', TENANT_ID)
        .order('display_order', { ascending: true })
      setMediaItems(data || [])
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Site Media</h1>
        <button 
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius)', backgroundColor: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
          onClick={() => alert("Image upload requires setting up a Supabase Storage bucket first. Feature coming soon!")}
        >
          <Upload size={20} /> Upload Image
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <ImageIcon size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--muted)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No Media Uploaded</h3>
          <p style={{ color: 'var(--muted)' }}>Images you upload for materials and site banners will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {mediaItems.map(media => (
            <div key={media.id} className="card" style={{ overflow: 'hidden', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ height: '180px', backgroundColor: 'var(--muted)', position: 'relative' }}>
                {media.image_url ? (
                  <img src={media.image_url} alt="Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon size={32} color="white" />
                  </div>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Slot: {media.slot_key}</p>
                {media.categories?.name && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Category: {media.categories.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
