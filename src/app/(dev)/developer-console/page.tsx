"use client";
import { useState } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation";

export default function DeveloperConsoleLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
    } else {
      router.push("/dev");
      router.refresh();
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#020617', color: '#f8fafc' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#0f172a', borderColor: '#1e293b' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Developer Console</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Super-admin access only</p>
        
        {error && (
          <div style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Developer Email</label>
            <input type="email" required className="input" placeholder="dev@ssbuild.com" value={email} onChange={e => setEmail(e.target.value)} style={{ backgroundColor: '#1e293b', color: 'white', borderColor: '#334155' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
            <input type="password" required className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ backgroundColor: '#1e293b', color: 'white', borderColor: '#334155' }} />
          </div>
          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '1rem' }}>Access Console</button>
        </form>
      </div>
    </div>
  );
}
