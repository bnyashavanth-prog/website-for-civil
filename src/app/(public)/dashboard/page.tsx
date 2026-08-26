"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, Package, Truck, Copy, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchMyBookings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      setBookings(data || []);
      setLoading(false);
    };
    fetchMyBookings();
  }, [router, supabase]);

  const copyTracking = (tn: string, id: string) => {
    navigator.clipboard.writeText(tn);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    const classMap: any = {
      pending: 'status-warning',
      confirmed: 'status-teal',
      in_progress: 'status-warning',
      delivered: 'status-success',
      cancelled: 'status-danger'
    };
    return (
      <span className={`status-pill ${classMap[status] || 'status-warning'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '500' }}>My Dashboard</h1>
          <button onClick={async () => {
             await supabase.auth.signOut();
             router.push('/login');
          }} className="btn btn-outline" style={{ color: 'var(--status-danger)', borderColor: 'rgba(248, 113, 113, 0.3)' }}>
            Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
          <Link href="/booking" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={16} /> Request Material
          </Link>
          <Link href="/track" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--accent-teal)', color: 'var(--accent-teal)' }}>
            <Truck size={16} /> Track Delivery
          </Link>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Active &amp; Historical Bookings
          </h2>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 size={32} color="var(--accent-amber)" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Package size={32} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
              <p>No orders yet. Place your first order to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map(booking => (
                <div key={booking.id} style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-card)',
                  backgroundColor: 'var(--bg-base)',
                  borderLeft: booking.tracking_number ? '3px solid var(--accent-teal)' : '1px solid var(--border-hairline)'
                }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 className="number-font" style={{ fontWeight: '500', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Order #{booking.id.substring(0, 8).toUpperCase()}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        Placed {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  {/* Tracking Number Banner — only show when confirmed/in_progress */}
                  {booking.tracking_number && (
                    <div style={{
                      backgroundColor: 'rgba(45, 212, 191, 0.08)',
                      border: '1px solid rgba(45, 212, 191, 0.2)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={16} color="var(--accent-teal)" />
                        <div>
                          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.125rem' }}>Tracking Number</p>
                          <span className="number-font" style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--teal-text)', letterSpacing: '0.04em' }}>
                            {booking.tracking_number}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => copyTracking(booking.tracking_number, booking.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === booking.id ? 'var(--status-success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                        >
                          {copiedId === booking.id ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                          {copiedId === booking.id ? 'Copied!' : 'Copy'}
                        </button>
                        <Link href={`/track?id=${booking.tracking_number}`} style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: '6px',
                          backgroundColor: 'var(--accent-teal)',
                          color: '#0B1A1A',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Truck size={12} /> Track Order
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Details grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payload</p>
                      <p style={{ fontWeight: '500' }}>{booking.booking_type === 'material' ? `${booking.quantity} Tons` : `${booking.quantity}-Wheeler Transport`}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Delivery Date</p>
                      <p className="number-font" style={{ fontWeight: '500' }}>{booking.delivery_date ? new Date(booking.delivery_date).toLocaleDateString() : '—'}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Destination</p>
                      <p style={{ fontWeight: '500' }}>{booking.delivery_location || '—'}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimated Charge</p>
                      <p className="number-font" style={{ fontWeight: '600', color: booking.estimated_price ? 'var(--status-success)' : 'var(--accent-amber)' }}>
                        {booking.estimated_price ? `₹${Number(booking.estimated_price).toLocaleString()}` : 'Awaiting review'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
