"use client";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '85vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(2, 6, 23, 0.7), rgba(2, 6, 23, 0.7)), url("https://images.unsplash.com/photo-1541888081622-2646271c61be?q=80&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '0 2rem'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Building the Future, <span style={{ color: 'var(--accent)' }}>One Load at a Time.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Premium quality sand, aggregate, and tar delivered directly to your site. Manage your logistics with our fleet of 150+ heavy-duty trucks.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/booking" className="btn btn-accent" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Book Materials <ArrowRight size={20} style={{ marginLeft: '0.5rem' }}/>
            </Link>
            <Link href="/booking/truck" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Hire a Truck
            </Link>
          </div>
        </div>
      </section>

      {/* Materials Showcase (Products) */}
      <section id="materials" style={{ padding: '6rem 2rem', backgroundColor: 'var(--background)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--foreground)' }}>Premium Materials</h2>
            <p style={{ color: 'gray', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>Sourced from the best quarries and delivered with unmatched reliability.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Material Card 1 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
              <div style={{ height: '220px', backgroundImage: 'url("https://images.unsplash.com/photo-1625624792612-4217fa52994e?q=80&w=600")', backgroundSize: 'cover' }}></div>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--card)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>M-Sand & P-Sand</h3>
                <p style={{ color: 'gray', fontSize: '0.875rem', marginBottom: '1rem' }}>High quality manufactured sand ideal for concrete and plastering.</p>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>From ₹1,200 / Ton</span>
              </div>
            </div>

            {/* Material Card 2 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
              <div style={{ height: '220px', backgroundImage: 'url("https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?q=80&w=600")', backgroundSize: 'cover' }}></div>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--card)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Aggregates (Stone)</h3>
                <p style={{ color: 'gray', fontSize: '0.875rem', marginBottom: '1rem' }}>20mm, 40mm crushed stone aggregates for strong foundations.</p>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>From ₹950 / Ton</span>
              </div>
            </div>

            {/* Material Card 3 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
              <div style={{ height: '220px', backgroundImage: 'url("https://images.unsplash.com/photo-1590479152345-4293f9c6f2a5?q=80&w=600")', backgroundSize: 'cover' }}></div>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--card)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bitumen & Tar</h3>
                <p style={{ color: 'gray', fontSize: '0.875rem', marginBottom: '1rem' }}>Premium road construction materials heated and delivered on-site.</p>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>From ₹3,400 / Ton</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Features */}
      <section id="services" style={{ padding: '6rem 2rem', backgroundColor: '#f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(30, 58, 138, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <Truck size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>150+ Fleet Capacity</h3>
            <p style={{ color: 'gray', lineHeight: 1.6 }}>Our massive fleet of 10, 14, and 16-wheelers ensures we can handle projects of any scale without delays.</p>
          </div>
          <div>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(217, 119, 6, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              <MapPin size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Live GPS Tracking</h3>
            <p style={{ color: 'gray', lineHeight: 1.6 }}>Track your materials from quarry to site in real-time through our state-of-the-art customer portal.</p>
          </div>
          <div>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(22, 163, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#16a34a' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Verified Quality</h3>
            <p style={{ color: 'gray', lineHeight: 1.6 }}>Every load is weighed and quality-checked. Transparent invoicing and secure payment gateways.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
