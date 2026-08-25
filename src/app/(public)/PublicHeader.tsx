"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HardHat, Sun, Moon } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useTheme } from '@/components/ThemeProvider';

export default function PublicHeader() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  
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
    window.location.href = "/login";
  };

  const isLight = theme === 'light';

  return (
    <header style={{ 
      position: 'sticky', top: 0, zIndex: 50, 
      backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(30, 26, 20, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '0.5px solid var(--border-hairline)',
      padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      transition: 'background-color 0.2s ease'
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
      
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          style={{
            width: '36px', height: '36px',
            borderRadius: '8px',
            border: '1px solid var(--border-hairline)',
            backgroundColor: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s ease-out',
          }}
        >
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {!loading && (
          user ? (
            <>
              <Link href="/dashboard" className="nav-link" style={{ fontSize: '0.875rem', padding: '0.5rem' }}>Dashboard</Link>
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', padding: '0.5rem', color: 'var(--text-secondary)' }}>Logout</button>
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
