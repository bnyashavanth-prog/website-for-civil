"use client";
import { useState } from "react";
import { Search, MapPin, Truck, CheckCircle2 } from "lucide-react";

export default function TrackOrder() {
  const [trackingId, setTrackingId] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-base)', minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '1rem', textAlign: 'center' }}>Track Delivery</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '0.875rem' }}>Enter your Booking ID to see live GPS tracking and delivery status.</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          <input 
            type="text" 
            className="input number-font" 
            placeholder="e.g. BK-001" 
            style={{ padding: '0.875rem 1rem', fontSize: '1rem' }}
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button className="btn btn-primary" style={{ padding: '0 2rem' }} onClick={() => setIsTracking(true)}>
            <Search size={18} style={{ marginRight: '0.5rem' }}/> Track
          </button>
        </div>

        {isTracking && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
             {/* Map Placeholder */}
             <div style={{ height: '300px', backgroundColor: 'var(--bg-surface)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '0.5px solid var(--border-hairline)' }}>
                <div style={{ position: 'absolute', top: '40%', left: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Truck size={32} color="var(--accent-teal)" />
                  <div className="number-font" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-base)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500', marginTop: '0.5rem', border: '1px solid var(--border-hairline)' }}>
                    ETA: 45 MINS
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '20%', left: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
                  <MapPin size={32} color="var(--accent-terracotta)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', marginTop: '0.25rem', color: 'var(--text-muted)' }}>DESTINATION</span>
                </div>
             </div>

             {/* Status Timeline */}
             <div style={{ padding: '2rem' }}>
               <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <span className="status-pill status-teal">EN ROUTE</span>
               </h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'var(--border-hairline)', zIndex: 0 }}></div>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', zIndex: 1 }}>
                    <div style={{ backgroundColor: 'var(--accent-teal)', color: 'var(--bg-base)', borderRadius: '50%', padding: '0.25rem', display: 'flex' }}><CheckCircle2 size={16} /></div>
                    <div>
                      <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>Order Confirmed</p>
                      <p className="number-font" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>MAR 12, 09:00 AM</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', zIndex: 1 }}>
                    <div style={{ backgroundColor: 'var(--accent-teal)', color: 'var(--bg-base)', borderRadius: '50%', padding: '0.25rem', display: 'flex' }}><CheckCircle2 size={16} /></div>
                    <div>
                      <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>Dispatched from Quarry</p>
                      <p className="number-font" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>MAR 12, 11:30 AM</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', zIndex: 1 }}>
                    <div style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)', borderRadius: '50%', padding: '0.25rem', border: '2px solid var(--border-hairline)', display: 'flex' }}><Truck size={16} /></div>
                    <div>
                      <p style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Delivered</p>
                      <p className="number-font" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PENDING</p>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
