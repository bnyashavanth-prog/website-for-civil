import Link from "next/link";
import { HardHat } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 50, 
        backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
          <HardHat size={28} />
          SS Build
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
          <Link href="#services" style={{ padding: '0.5rem' }}>Services</Link>
          <Link href="#materials" style={{ padding: '0.5rem' }}>Materials</Link>
          <Link href="/track" style={{ padding: '0.5rem' }}>Track Order</Link>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" className="btn btn-outline">Login</Link>
          <Link href="/booking" className="btn btn-primary">Book Now</Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)', padding: '3rem 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HardHat size={24} /> SS Build Pvt Ltd
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Premium materials and reliable logistics. Connecting your projects with the resources they need.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/booking">Book Materials</Link></li>
              <li><Link href="/track">Track Delivery</Link></li>
              <li><Link href="/admin-login">Staff Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Contact</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Email: contact@ssbuild.com</p>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Phone: +91 98765 43210</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
