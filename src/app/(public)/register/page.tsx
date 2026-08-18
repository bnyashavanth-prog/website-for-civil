"use client";
import { useState } from "react";
import Link from "next/link";
import { HardHat } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation";

export default function CustomerRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { full_name: name, role: 'customer' } }
    });
    
    if (error) {
      setError(error.message);
    } else {
      setMessage("Registration successful! You can now log in.");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-base)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <HardHat size={40} color="var(--accent-amber)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '500' }}>Create account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Join SS Build for seamless material ordering.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid var(--status-danger)', color: 'var(--status-danger)', padding: '0.75rem', borderRadius: 'var(--radius-btn)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid var(--status-success)', color: 'var(--status-success)', padding: '0.75rem', borderRadius: 'var(--radius-btn)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Company / Full Name</label>
            <input type="text" required className="input" placeholder="Acme Corp" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Email</label>
            <input type="email" required className="input" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" required className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Register</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--amber-text)', fontWeight: '500' }}>Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
