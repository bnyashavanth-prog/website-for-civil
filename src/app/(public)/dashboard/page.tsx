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
    const colors: any = {
      pending: { bg: '#fef08a', text: '#854d0e' },
      confirmed: { bg: '#bfdbfe', text: '#1e40af' },
      in_progress: { bg: '#ddd6fe', text: '#5b21b6' },
      delivered: { bg: '#bbf7d0', text: '#166534' },
      cancelled: { bg: '#fecaca', text: '#991b1b' }
    };
    const color = colors[status] || colors.pending;
    
    return (
      <span style={{ 
        padding: '0.25rem 0.5rem', 
        borderRadius: '999px', 
        fontSize: '0.75rem', 
        fontWeight: '500',
        textTransform: 'uppercase',
        backgroundColor: color.bg,
        color: color.text
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: '#f1f5f9', minHeight: '80vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Dashboard</h1>
          <button onClick={async () => {
             await supabase.auth.signOut();
             router.push('/login');
          }} className="btn btn-outline" style={{ color: 'red', borderColor: 'red' }}>
            Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/booking" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} /> Book Materials
          </Link>
          <Link href="/track" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={18} /> Track Order
          </Link>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>My Orders</h2>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'gray' }}>
              <Package size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map(booking => (
                <div key={booking.id} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Order #{booking.id.substring(0,8)}</h3>
                      <p style={{ color: 'gray', fontSize: '0.875rem', marginTop: '0.25rem' }}>Placed on {new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <p style={{ color: 'gray', marginBottom: '0.25rem' }}>Material & Quantity</p>
                      <p style={{ fontWeight: '500' }}>{booking.booking_type === 'material' ? `${booking.quantity} Tons` : 'Truck Only'}</p>
                    </div>
                    <div>
                      <p style={{ color: 'gray', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14}/> Delivery Date</p>
                      <p style={{ fontWeight: '500' }}>{new Date(booking.delivery_date).toLocaleString()}</p>
                    </div>
                    <div>
                      <p style={{ color: 'gray', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14}/> Location</p>
                      <p style={{ fontWeight: '500' }}>{booking.delivery_location}</p>
                    </div>
                    <div>
                      <p style={{ color: 'gray', marginBottom: '0.25rem' }}>Estimated Price</p>
                      <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{booking.estimated_price ? `₹${booking.estimated_price}` : 'Pending Admin Review'}</p>
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
