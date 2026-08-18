import Link from "next/link";
import { HardHat } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Premium Dark Header */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 50, 
        backgroundColor: 'rgba(8, 11, 16, 0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
          <HardHat size={28} color="var(--accent-amber)" />
          <span className="heading-font">SS BUILD</span>
        </Link>
        <nav style={{ display: 'flex', gap: '2rem', fontWeight: '500', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Link href="/#services" style={{ padding: '0.5rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-amber)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Services</Link>
          <Link href="/#materials" style={{ padding: '0.5rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-amber)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Materials</Link>
          <Link href="/track" style={{ padding: '0.5rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-amber)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Track Order</Link>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" className="btn btn-outline">Login</Link>
          <Link href="/booking" className="btn btn-primary">Book Materials</Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Dark Footer */}
      <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', color: 'var(--text-primary)', padding: '4rem 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem' }}>
          <div>
            <h3 className="heading-font" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em' }}>
              <HardHat size={24} color="var(--accent-amber)" /> SS BUILD PVT LTD
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Construction materials and reliable truck delivery, managed from one powerful platform.
            </p>
          </div>
          <div>
            <h4 className="heading-font" style={{ fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>PLATFORM</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <li><Link href="/" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-amber)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Home</Link></li>
              <li><Link href="/booking" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-amber)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Book Materials</Link></li>
              <li><Link href="/track" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-amber)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Track Delivery</Link></li>
              <li><Link href="/admin-login" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-amber)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Staff Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="heading-font" style={{ fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>CONTACT</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email: contact@ssbuild.com</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Phone: +91 98765 43210</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
