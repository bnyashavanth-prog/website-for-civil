"use client";
import { useState } from "react";
import Link from "next/link";
import { HardHat } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation";

export default function CustomerLogin() {
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
      router.push("/booking");
      router.refresh();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <HardHat size={40} color="var(--primary)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Customer Login</h1>
          <p style={{ color: 'gray', fontSize: '0.875rem' }}>Sign in to manage your bookings and live tracking.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
            <input type="email" required className="input" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <input type="password" required className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Sign In</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'gray' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
