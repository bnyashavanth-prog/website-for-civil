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
    const { data } = await supabase.from('site_media').select('*, categories(name)').eq('tenant_id', TENANT_ID).order('display_order', { ascending: true })
    setMediaItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchMedia() }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem' }}>Site Media</h1>
        <button style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem', borderRadius: '8px', backgroundColor: '#CC6A2E', color: '#241000', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.8125rem' }}
          onClick={() => alert("Image upload requires Supabase Storage bucket setup.")}>
          <Upload size={16} /> Upload
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} color="#4C6EF5" style={{ animation: 'spin 1s linear infinite' }} /></div>
      ) : mediaItems.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <ImageIcon size={28} style={{ margin: '0 auto 0.75rem', color: '#5F6A78', opacity: 0.5 }} />
          <p style={{ color: '#5F6A78', fontSize: '0.8125rem' }}>No media uploaded. Material images and banners will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {mediaItems.map(media => (
            <div key={media.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ height: '140px', backgroundColor: '#0D1117', position: 'relative' }}>
                {media.image_url ? (
                  <img src={media.image_url} alt="Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={20} color="#5F6A78" /></div>
                )}
              </div>
              <div style={{ padding: '0.875rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>{media.slot_key}</p>
                {media.categories?.name && <p style={{ fontSize: '0.6875rem', color: '#5F6A78' }}>{media.categories.name}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
