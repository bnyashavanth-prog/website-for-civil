"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Server, Users, AlertTriangle, HardHat } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/developer-console');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2rem', padding: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HardHat size={20} /> Dev Console
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Super-Admin Access</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/dev" className="btn" style={{ justifyContent: 'flex-start', color: '#f8fafc', padding: '0.75rem' }}>
            <Server size={18} style={{ marginRight: '0.75rem' }} /> Overview
          </Link>
          <Link href="/dev/tenants" className="btn" style={{ justifyContent: 'flex-start', color: '#f8fafc', padding: '0.75rem' }}>
            <Users size={18} style={{ marginRight: '0.75rem' }} /> Tenants
          </Link>
          <Link href="/dev/errors" className="btn" style={{ justifyContent: 'flex-start', color: '#f8fafc', padding: '0.75rem' }}>
            <AlertTriangle size={18} style={{ marginRight: '0.75rem', color: '#ef4444' }} /> Error Logs
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
          <button onClick={handleLogout} className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444', padding: '0.75rem' }}>
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
