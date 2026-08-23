"use client";
import { useState } from "react";
import { Loader2, Radio } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) { setError(signInError.message); setLoading(false); return; }
      if (data?.session) {
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = "/admin";
      } else { setError("Login failed."); setLoading(false); }
    } catch (err) { setError("An unexpected error occurred."); setLoading(false); }
  };

  return (
    <div className="theme-fig2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0B0E13' }}>
      <div style={{ width: '100%', maxWidth: '360px', backgroundColor: '#12161D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(76, 110, 245, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Radio size={22} color="#4C6EF5" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#EDEFF2' }}>Staff login</h2>
          <p style={{ color: '#5F6A78', fontSize: '0.8125rem', marginTop: '0.375rem' }}>SS Build operations portal</p>
        </div>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', color: '#F87171', padding: '0.625rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.8125rem', fontWeight: '500' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.6875rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Email</label>
            <input type="email" required className="input" placeholder="admin@ssbuild.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading}
              style={{ backgroundColor: '#0B0E13', border: '1px solid rgba(255,255,255,0.07)', color: '#EDEFF2', padding: '0.625rem 0.875rem', borderRadius: '8px', fontSize: '0.875rem', width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.6875rem', color: '#5F6A78', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Password</label>
            <input type="password" required className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={loading}
              style={{ backgroundColor: '#0B0E13', border: '1px solid rgba(255,255,255,0.07)', color: '#EDEFF2', padding: '0.625rem 0.875rem', borderRadius: '8px', fontSize: '0.875rem', width: '100%' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.625rem', borderRadius: '8px', backgroundColor: '#CC6A2E', color: '#241000', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', opacity: loading ? 0.5 : 1 }}>
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Logging in...</> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
