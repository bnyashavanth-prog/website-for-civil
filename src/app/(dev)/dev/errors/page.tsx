"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AlertTriangle, Filter, CheckCircle } from "lucide-react";

export default function ErrorLogsViewer() {
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchErrors();
  }, [filter]);

  const fetchErrors = async () => {
    setLoading(true);
    let query = supabase
      .from('error_logs')
      .select(`
        *,
        tenants ( name )
      `)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('severity', filter);
    }
      
    const { data } = await query;
      
    if (data) setErrors(data);
    setLoading(false);
  };

  const markAsResolved = async (id: string) => {
    const { error } = await supabase
      .from('error_logs')
      .update({ resolved: true })
      .eq('id', id);
      
    if (!error) {
      fetchErrors();
    } else {
      alert("Error resolving log: " + error.message);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return '#ef4444'; // red
      case 'error': return '#f97316'; // orange
      case 'warning': return '#eab308'; // yellow
      case 'info': return '#3b82f6'; // blue
      default: return '#94a3b8'; // gray
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={24} color="#ef4444" /> System Error Logs
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#0f172a', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid #1e293b' }}>
          <Filter size={16} color="#94a3b8" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ backgroundColor: 'transparent', color: '#f8fafc', border: 'none', outline: 'none' }}
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
        {loading ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>Loading error logs...</p>
        ) : errors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No error logs found for this filter.</p>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Your systems are running smoothly.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {errors.map(err => (
               <div key={err.id} style={{ 
                 backgroundColor: '#020617', 
                 border: '1px solid #1e293b', 
                 borderLeft: `4px solid ${getSeverityColor(err.severity)}`, 
                 padding: '1.5rem',
                 borderRadius: '4px',
                 opacity: err.resolved ? 0.6 : 1
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                   <div>
                     <span style={{ 
                       padding: '0.25rem 0.5rem', 
                       backgroundColor: `${getSeverityColor(err.severity)}20`, 
                       color: getSeverityColor(err.severity), 
                       borderRadius: '4px', 
                       fontSize: '0.75rem',
                       fontWeight: '600',
                       marginRight: '0.75rem',
                       textTransform: 'uppercase'
                     }}>
                       {err.severity || 'UNKNOWN'}
                     </span>
                     <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                       {err.tenants?.name || 'Unknown Tenant'} • {new Date(err.created_at).toLocaleString()}
                     </span>
                   </div>
                   
                   {!err.resolved && (
                     <button 
                       onClick={() => markAsResolved(err.id)}
                       className="btn btn-outline" 
                       style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: '#16a34a', borderColor: '#16a34a' }}
                     >
                       Mark Resolved
                     </button>
                   )}
                   {err.resolved && (
                     <span style={{ color: '#16a34a', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                       <CheckCircle size={14} /> Resolved
                     </span>
                   )}
                 </div>
                 
                 <p style={{ fontWeight: '500', fontSize: '1rem', marginBottom: '0.5rem', color: '#f8fafc' }}>{err.message}</p>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
                   <div>
                     <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Source</p>
                     <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{err.source || 'N/A'}</p>
                   </div>
                   {err.context && (
                     <div>
                       <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Context</p>
                       <p style={{ fontSize: '0.875rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                         {typeof err.context === 'object' ? JSON.stringify(err.context) : err.context}
                       </p>
                     </div>
                   )}
                 </div>
                 
                 {err.stack_trace && (
                   <div style={{ marginTop: '1rem' }}>
                     <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Stack Trace</p>
                     <pre style={{ 
                       backgroundColor: '#0f172a', 
                       padding: '1rem', 
                       borderRadius: '4px', 
                       fontSize: '0.75rem', 
                       color: '#f87171',
                       overflowX: 'auto',
                       whiteSpace: 'pre-wrap'
                     }}>
                       {err.stack_trace}
                     </pre>
                   </div>
                 )}
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
