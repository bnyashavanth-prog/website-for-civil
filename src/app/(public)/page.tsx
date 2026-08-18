"use client";

import Link from "next/link";
import { Truck, MapPin, Package, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', position: 'relative' }}>
      
      {/* HERO SECTION */}
      <div style={{ padding: '8rem 2rem 6rem', backgroundColor: 'var(--bg-base)', borderBottom: '0.5px solid var(--border-hairline)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '500', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Materials and logistics.<br/>
              <span style={{ color: 'var(--accent-terracotta)' }}>Managed in one place.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', lineHeight: 1.6 }}>
              A robust platform for booking sand, stone, and tar materials with reliable truck fleet delivery tracking.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/booking" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                Book Material <ArrowRight size={18} style={{ marginLeft: '0.5rem' }}/>
              </Link>
              <Link href="/booking/truck" className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1rem', borderColor: 'var(--accent-terracotta)', color: 'var(--accent-terracotta)' }}>
                Book A Truck
              </Link>
            </div>
          </div>
          
          {/* Subtle metrics strip */}
          <div style={{ display: 'flex', gap: '3rem', marginTop: '5rem', paddingTop: '2rem', borderTop: '0.5px solid var(--border-hairline)' }}>
             <div>
                <div className="number-font" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>150+</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Trucks in Fleet</div>
             </div>
             <div>
                <div className="number-font" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>5,000+</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Deliveries Completed</div>
             </div>
             <div>
                <div className="number-font" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>10+</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Years of Logistics</div>
             </div>
          </div>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div id="services" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '500', marginBottom: '3rem' }}>
            Core Services
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            <div className="card">
              <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '0.75rem', backgroundColor: 'rgba(232, 135, 30, 0.1)', borderRadius: '8px' }}>
                 <Package size={24} color="var(--accent-amber)"/>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem' }}>Material Supply</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Order construction materials with transparent quantities and pricing. View our full catalog of sand, stone, and tar.
              </p>
              <Link href="/booking" style={{ color: 'var(--accent-amber)', fontSize: '0.875rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}>
                Browse Materials <ArrowRight size={16} style={{ marginLeft: '0.25rem' }}/>
              </Link>
            </div>

            <div className="card">
              <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '0.75rem', backgroundColor: 'rgba(193, 68, 14, 0.1)', borderRadius: '8px' }}>
                 <Truck size={24} color="var(--accent-terracotta)"/>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem' }}>Truck Fleet</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Request the right truck capacity for your specific delivery needs. Our operations team assigns the most suitable vehicle.
              </p>
              <Link href="/booking/truck" style={{ color: 'var(--accent-terracotta)', fontSize: '0.875rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}>
                Book Transport <ArrowRight size={16} style={{ marginLeft: '0.25rem' }}/>
              </Link>
            </div>

            <div className="card">
              <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '0.75rem', backgroundColor: 'rgba(45, 212, 191, 0.1)', borderRadius: '8px' }}>
                 <MapPin size={24} color="var(--accent-teal)"/>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem' }}>Live Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Know exactly where your delivery is in real-time. Full GPS visibility for active transits directly in your dashboard.
              </p>
              <Link href="/track" style={{ color: 'var(--accent-teal)', fontSize: '0.875rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}>
                Track Order <ArrowRight size={16} style={{ marginLeft: '0.25rem' }}/>
              </Link>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
