"use client";
import { Truck, MapPin } from "lucide-react";

export default function FleetMap() {
  return (
    <div style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Live Fleet Map</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#16a34a' }}></div> Active (12)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'gray' }}></div> Idle (30)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'red' }}></div> Maintenance (5)</span>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: '#e2e8f0', borderRadius: 'var(--radius)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        {/* Placeholder for actual Google Maps / Mapbox component */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'gray' }}>
           <MapPin size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
           <p>Mapbox / Google Maps Integration goes here.</p>
           <p style={{ fontSize: '0.875rem' }}>Subscribed to Supabase Realtime <code>gps_locations</code> channel.</p>
        </div>

        {/* Mock Truck Marker */}
        <div style={{ position: 'absolute', top: '30%', left: '45%', backgroundColor: 'white', padding: '0.5rem', borderRadius: 'var(--radius)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Truck size={16} color="#16a34a" />
           <div>
             <p style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>KA-01-AB-1234</p>
             <p style={{ fontSize: '0.65rem', color: 'gray' }}>Speed: 45 km/h</p>
           </div>
        </div>
      </div>
    </div>
  );
}
