"use client";
import { useState } from "react";
import { Search, MapPin, Truck, CheckCircle2 } from "lucide-react";

export default function TrackOrder() {
  const [trackingId, setTrackingId] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Track Your Delivery</h1>
        <p style={{ textAlign: 'center', color: 'gray', marginBottom: '3rem' }}>Enter your Booking ID to see live GPS tracking and delivery status.</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="e.g. BK-001" 
            style={{ padding: '1rem', fontSize: '1.125rem' }}
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button className="btn btn-primary" style={{ padding: '0 2rem' }} onClick={() => setIsTracking(true)}>
            <Search size={20} style={{ marginRight: '0.5rem' }}/> Track
          </button>
        </div>

        {isTracking && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
             {/* Map Placeholder */}
             <div style={{ height: '300px', backgroundColor: '#e2e8f0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', top: '40%', left: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Truck size={32} color="var(--primary)" />
                  <div style={{ padding: '0.25rem 0.5rem', backgroundColor: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    ETA: 45 Mins
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '20%', left: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
                  <MapPin size={32} color="red" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Destination</span>
                </div>
             </div>

             {/* Status Timeline */}
             <div style={{ padding: '2rem' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Status: En Route</h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'var(--border)', zIndex: 0 }}></div>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', zIndex: 1 }}>
                    <div style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '0.25rem' }}><CheckCircle2 size={16} /></div>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>Order Confirmed</p>
                      <p style={{ fontSize: '0.875rem', color: 'gray' }}>March 12, 09:00 AM</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', zIndex: 1 }}>
                    <div style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '0.25rem' }}><CheckCircle2 size={16} /></div>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>Dispatched from Quarry</p>
                      <p style={{ fontSize: '0.875rem', color: 'gray' }}>March 12, 11:30 AM</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', zIndex: 1 }}>
                    <div style={{ backgroundColor: 'var(--card)', color: 'gray', borderRadius: '50%', padding: '0.25rem', border: '2px solid var(--border)' }}><Truck size={16} /></div>
                    <div>
                      <p style={{ fontWeight: 'bold', color: 'gray' }}>Delivered</p>
                      <p style={{ fontSize: '0.875rem', color: 'gray' }}>Pending</p>
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
