"use client";
import { useState } from "react";
import { Server, Activity, Users, Plus, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DevConsoleDashboard() {
  const [tenants] = useState([
    { id: '1', name: 'SS Build Pvt Ltd', slug: 'ssbuild', status: 'active', errors: 2 },
    { id: '2', name: 'Alpha Logistics', slug: 'alphalogistics', status: 'active', errors: 0 },
    { id: '3', name: 'Metro Materials', slug: 'metro', status: 'suspended', errors: 15 }
  ]);

  const [errors] = useState([
    { id: 'err-1', tenant: 'SS Build Pvt Ltd', source: 'payment_webhook', severity: 'critical', message: 'Invalid signature from gateway', time: '10 mins ago' },
    { id: 'err-2', tenant: 'Metro Materials', source: 'gps_ingestion', severity: 'warning', message: 'Device auth failure', time: '1 hr ago' },
  ]);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>System Overview</h1>
      
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} /> Total Tenants
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>3</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} /> Global API Requests
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>42.5K <span style={{ fontSize: '1rem', color: '#16a34a' }}>/hr</span></p>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} color="#ef4444" /> Unresolved Errors
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>17</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Tenants Table */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Provisioned Tenants</h2>
            <button className="btn btn-accent" style={{ padding: '0.5rem 1rem' }}><Plus size={16} style={{ marginRight: '0.5rem' }}/> New Tenant</button>
          </div>
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
                  <td style={{ color: '#94a3b8' }}>{t.slug}.domain.com</td>
                  <td>
                    <span style={{ padding: '0.25rem 0.5rem', backgroundColor: t.status === 'active' ? 'rgba(22, 163, 74, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: t.status === 'active' ? '#4ade80' : '#f87171', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Global Error Log */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#eab308" /> Security & Errors
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {errors.map(err => (
               <div key={err.id} style={{ borderLeft: `3px solid ${err.severity === 'critical' ? '#ef4444' : '#f59e0b'}`, paddingLeft: '1rem' }}>
                 <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>{err.tenant} • {err.time}</p>
                 <p style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{err.message}</p>
                 <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Source: {err.source}</p>
               </div>
             ))}
          </div>
          <button className="btn" style={{ width: '100%', marginTop: '1.5rem', border: '1px solid #1e293b' }}>View All Logs</button>
        </div>
      </div>
    </div>
  );
}
