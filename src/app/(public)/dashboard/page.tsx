"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, Package, Calendar, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchMyBookings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

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

  const getStatusBadge = (status: string) => {
    const classMap: any = {
      pending: 'status-warning',
      confirmed: 'status-teal', // Confirmed but not yet delivered
      in_progress: 'status-warning', // In transit
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: '500' }}>Overview</h1>
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
            <Truck size={16} /> Live Fleet
          </Link>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Active & Historical Bookings</h2>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 size={32} color="var(--accent-amber)" style={{ animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Package size={32} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
              <p>No dispatch records found.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map(booking => (
                <div key={booking.id} style={{ padding: '1.25rem', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-card)', backgroundColor: 'var(--bg-base)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 className="number-font" style={{ fontWeight: '500', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ID: {booking.id.substring(0,8).toUpperCase()}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Recorded {new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', fontSize: '0.875rem' }}>
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>Payload</p>
                      <p style={{ fontWeight: '500' }}>{booking.booking_type === 'material' ? `${booking.quantity} Tons` : 'Transport'}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>ETA / Date</p>
                      <p className="number-font" style={{ fontWeight: '500' }}>{new Date(booking.delivery_date).toLocaleString()}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>Destination</p>
                      <p style={{ fontWeight: '500' }}>{booking.delivery_location}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>Estimated Charge</p>
                      <p className="number-font" style={{ fontWeight: '500', color: booking.estimated_price ? 'var(--text-primary)' : 'var(--accent-amber)' }}>
                        {booking.estimated_price ? `₹${booking.estimated_price}` : 'Awaiting Dispatch'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
