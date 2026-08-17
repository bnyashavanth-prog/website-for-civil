"use client";
import { useState, useEffect } from "react";
import { Server, Activity, Users, Plus, AlertTriangle, ShieldCheck } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export default function DevConsoleDashboard() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [totalTenants, setTotalTenants] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [unresolvedErrors, setUnresolvedErrors] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Fetch total tenants count
    const { count: tenantsCount } = await supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true });
    
    setTotalTenants(tenantsCount || 0);

    // Fetch total users count
    const { count: usersCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
      
    setTotalUsers(usersCount || 0);

    // Fetch unresolved errors count
    const { count: errorsCount } = await supabase
      .from('error_logs')
      .select('*', { count: 'exact', head: true })
      .eq('resolved', false);
      
    setUnresolvedErrors(errorsCount || 0);

    // Fetch recent tenants
    const { data: tenantsData } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
      
    setTenants(tenantsData || []);

    // Fetch recent error logs
    const { data: errorsData } = await supabase
      .from('error_logs')
      .select(`
        *,
        tenants ( name )
      `)
      .order('created_at', { ascending: false })
      .limit(5);
      
    setErrors(errorsData || []);
    
    setLoading(false);
  };

  if (loading) {
    return <div style={{ color: '#94a3b8' }}>Loading dashboard data...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>System Overview</h1>
      
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} /> Total Tenants
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalTenants}</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} /> Total Users
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalUsers}</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} color="#ef4444" /> Unresolved Errors
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: unresolvedErrors > 0 ? '#ef4444' : '#16a34a' }}>{unresolvedErrors}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Tenants Table */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Tenants</h2>
            <Link href="/dev/tenants" className="btn btn-accent" style={{ padding: '0.5rem 1rem' }}>
              View All
            </Link>
          </div>
          {tenants.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>No tenants provisioned yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '0.75rem 0', fontWeight: '500', color: '#94a3b8' }}>Company Name</th>
                  <th style={{ padding: '0.75rem 0', fontWeight: '500', color: '#94a3b8' }}>Slug</th>
                  <th style={{ padding: '0.75rem 0', fontWeight: '500', color: '#94a3b8' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '1rem 0', fontWeight: '500' }}>{t.name}</td>
                    <td style={{ color: '#94a3b8' }}>{t.slug}</td>
                    <td>
                      <span style={{ padding: '0.25rem 0.5rem', backgroundColor: t.status === 'active' ? 'rgba(22, 163, 74, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: t.status === 'active' ? '#4ade80' : '#f87171', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {t.status ? t.status.toUpperCase() : 'UNKNOWN'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Global Error Log */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#eab308" /> Recent Errors
          </h2>
          {errors.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>No error logs found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {errors.map(err => (
                 <div key={err.id} style={{ borderLeft: `3px solid ${err.severity === 'critical' || err.severity === 'error' ? '#ef4444' : '#f59e0b'}`, paddingLeft: '1rem' }}>
                   <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                     {err.tenants?.name || 'Unknown Tenant'} • {new Date(err.created_at).toLocaleString()}
                   </p>
                   <p style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{err.message}</p>
                   <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Source: {err.source}</p>
                 </div>
               ))}
            </div>
          )}
          <Link href="/dev/errors" className="btn" style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '1.5rem', border: '1px solid #1e293b', padding: '0.5rem' }}>
            View All Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
