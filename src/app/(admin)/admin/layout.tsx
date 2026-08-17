import Link from "next/link";
import { LayoutDashboard, Image as ImageIcon, Package, Truck, Users, FileText, Settings } from "lucide-react";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--card)', borderRight: '1px solid var(--border)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2rem', padding: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>SS Build Admin</h2>
          <p style={{ fontSize: '0.75rem', color: 'gray' }}>Operations Portal</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <LayoutDashboard size={18} style={{ marginRight: '0.75rem' }} /> Dashboard
          </Link>
          <Link href="/admin/bookings" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <FileText size={18} style={{ marginRight: '0.75rem' }} /> Bookings
          </Link>
          <Link href="/admin/fleet" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <Truck size={18} style={{ marginRight: '0.75rem' }} /> Fleet Map
          </Link>
          <Link href="/admin/categories" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <Package size={18} style={{ marginRight: '0.75rem' }} /> Materials
          </Link>
          <Link href="/admin/media" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <ImageIcon size={18} style={{ marginRight: '0.75rem' }} /> Site Media
          </Link>
          <Link href="/admin/users" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <Users size={18} style={{ marginRight: '0.75rem' }} /> Staff & Drivers
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
           <Link href="/admin/settings" className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <Settings size={18} style={{ marginRight: '0.75rem' }} /> Settings
          </Link>
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', color: 'red', marginTop: '0.5rem' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
