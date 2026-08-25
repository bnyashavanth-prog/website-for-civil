"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HardHat } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function PublicHeader() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login"; // Force refresh to clear cookies properly
  };

  return (
    <header style={{ 
      position: 'sticky', top: 0, zIndex: 50, 
      backgroundColor: 'rgba(30, 26, 20, 0.95)', backdropFilter: 'blur(10px)',
      borderBottom: '0.5px solid var(--border-hairline)',
      padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500', fontSize: '1.125rem', color: 'var(--text-primary)' }}>
        <HardHat size={24} color="var(--accent-amber)" />
        <span>SS Build</span>
      </Link>
      
      <nav style={{ display: 'flex', gap: '2rem', fontWeight: '400', fontSize: '0.875rem' }}>
        <Link href="/#services" className="nav-link" style={{ padding: '0.5rem' }}>Services</Link>
        <Link href="/#materials" className="nav-link" style={{ padding: '0.5rem' }}>Materials</Link>
        <Link href="/track" className="nav-link" style={{ padding: '0.5rem' }}>Track Order</Link>
      </nav>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: '160px', justifyContent: 'flex-end' }}>
        {!loading && (
          user ? (
            <>
              <Link href="/dashboard" className="nav-link" style={{ fontSize: '0.875rem', padding: '0.5rem' }}>Dashboard</Link>
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', padding: '0.5rem' }}>Logout</button>
              <Link href="/booking" className="btn btn-primary">Book Materials</Link>
            </>
          ) : (
            <Link href="/login" className="btn btn-outline">Login</Link>
          )
        )}
      </div>
    </header>
  );
}
