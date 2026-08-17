export default function DeveloperConsoleLogin() {
  return (
    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#020617', color: '#f8fafc' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#0f172a', borderColor: '#1e293b' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Developer Console</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Super-admin access only</p>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Developer Email</label>
            <input type="email" className="input" placeholder="dev@ssbuild.com" style={{ backgroundColor: '#1e293b', color: 'white', borderColor: '#334155' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
            <input type="password" className="input" placeholder="••••••••" style={{ backgroundColor: '#1e293b', color: 'white', borderColor: '#334155' }} />
          </div>
          <button type="button" className="btn btn-accent" style={{ width: '100%', marginTop: '1rem' }}>Access Console</button>
        </form>
      </div>
    </div>
  );
}
