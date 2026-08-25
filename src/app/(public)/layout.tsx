import Link from "next/link";
import { HardHat } from "lucide-react";
import PublicHeader from "./PublicHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      {/* Dynamic Client Header */}
      <PublicHeader />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Flat Footer */}
      <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '0.5px solid var(--border-hairline)', color: 'var(--text-primary)', padding: '4rem 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HardHat size={20} color="var(--accent-amber)" /> SS Build Pvt Ltd
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Construction materials and reliable truck delivery, managed from one powerful platform.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: '500', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link href="/" className="nav-link">Home</Link></li>
              <li><Link href="/booking" className="nav-link">Book Materials</Link></li>
              <li><Link href="/track" className="nav-link">Track Delivery</Link></li>
              <li><Link href="/admin-login" className="nav-link">Staff Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: '500', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>Contact</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email: contact@ssbuild.com</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Phone: +91 98765 43210</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
