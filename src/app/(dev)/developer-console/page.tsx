"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'

export default function DeveloperConsoleLogin() {
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
      
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      
      if (data?.session) {
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = "/dev";
      } else {
        setError("Login failed. Please check your credentials.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#020617', color: '#f8fafc' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#0f172a', borderColor: '#1e293b' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Developer Console</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Super-admin access only</p>
        
        {error && (
          <div style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Developer Email</label>
            <input type="email" required className="input" placeholder="dev@ssbuild.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} style={{ backgroundColor: '#1e293b', color: 'white', borderColor: '#334155' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
            <input type="password" required className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} style={{ backgroundColor: '#1e293b', color: 'white', borderColor: '#334155' }} />
          </div>
          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Accessing...</> : 'Access Console'}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
