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
        <h1 style={{ fontSize: '1.25rem', fontWeight: '500' }}>Site Media</h1>
        <button 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => alert("Image upload requires setting up a Supabase Storage bucket first.")}
        >
          <Upload size={16} /> Upload
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 size={32} color="var(--accent-amber)" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <ImageIcon size={32} style={{ margin: '0 auto 1rem auto', color: 'var(--text-muted)', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No media uploaded yet. Images for materials and banners will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {mediaItems.map(media => (
            <div key={media.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ height: '160px', backgroundColor: 'var(--bg-base)', position: 'relative' }}>
                {media.image_url ? (
                  <img src={media.image_url} alt="Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon size={24} color="var(--text-muted)" />
                  </div>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <p style={{ fontWeight: '500', marginBottom: '0.25rem', fontSize: '0.875rem' }}>{media.slot_key}</p>
                {media.categories?.name && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{media.categories.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
