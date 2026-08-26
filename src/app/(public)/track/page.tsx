"use client";
import { useState, useEffect, Suspense } from "react";
import { Search, MapPin, Truck, CheckCircle2, Clock, Loader2, Package } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from "next/navigation";

function TrackOrderContent() {
  const [trackingId, setTrackingId] = useState("");
  const [searching, setSearching] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Auto-search if tracking number is in URL
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setTrackingId(idFromUrl);
      handleSearch(idFromUrl);
    }
  }, []);

  const handleSearch = async (id?: string) => {
    const searchId = (id || trackingId).trim().toUpperCase();
    if (!searchId) return;
    setSearching(true);
    setError("");
    setBooking(null);

    const { data, error: err } = await supabase
      .from('bookings')
      .select('*, customer:user_profiles!customer_id(first_name, last_name)')
      .eq('tracking_number', searchId)
      .single();

    if (err || !data) {
      setError("No order found with that tracking number. Please check and try again.");
    } else {
      setBooking(data);
    }
    setSearching(false);
  };

  const statusSteps = [
    { key: 'pending',    label: 'Order placed',       icon: Package },
    { key: 'confirmed',  label: 'Order confirmed',    icon: CheckCircle2 },
    { key: 'in_progress',label: 'In transit',         icon: Truck },
    { key: 'delivered',  label: 'Delivered',          icon: CheckCircle2 },
  ];

  const statusOrder = ['pending', 'confirmed', 'in_progress', 'delivered'];
  const currentStep = booking ? statusOrder.indexOf(booking.status) : -1;

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-base)', minHeight: '80vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '0.5rem', textAlign: 'center' }}>Track Delivery</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.875rem' }}>
          Enter your tracking number (e.g. <span style={{ fontFamily: 'monospace', color: 'var(--teal-text)' }}>SSB-20260826-AB12</span>) to get live status.
        </p>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <input
            type="text"
            className="input number-font"
            placeholder="SSB-YYYYMMDD-XXXX"
            style={{ padding: '0.875rem 1rem', fontSize: '1rem', textTransform: 'uppercase' }}
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="btn btn-primary"
            style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
            onClick={() => handleSearch()}
            disabled={searching}
          >
            {searching ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} />}
            Track
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid var(--status-danger)', color: 'var(--status-danger)', padding: '1rem', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            ⚠ {error}
          </div>
        )}

        {/* Result */}
        {booking && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Map placeholder with dark-mode filter */}
            <div style={{ height: '240px', position: 'relative', overflow: 'hidden', backgroundColor: '#0D1117' }}>
              <iframe
                width="100%" height="100%" frameBorder="0" scrolling="no"
                src={`https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=${encodeURIComponent(booking.delivery_location || 'Bangalore')}&t=&z=13&ie=UTF8&iwloc=B&output=embed`}
                style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(80%) contrast(115%)', position: 'absolute', inset: 0 }}
              />
              {/* Destination pin overlay */}
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', borderRadius: '8px', padding: '0.5rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1, fontSize: '0.8125rem' }}>
                <MapPin size={14} color="var(--status-danger)" />
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{booking.delivery_location}</span>
              </div>
            </div>

            {/* Booking details */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>Tracking Number</p>
                  <span className="number-font" style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--teal-text)' }}>{booking.tracking_number}</span>
                </div>
                <span className={`status-pill ${booking.status === 'delivered' ? 'status-success' : booking.status === 'cancelled' ? 'status-danger' : 'status-teal'}`} style={{ fontSize: '0.8125rem', padding: '0.375rem 0.875rem' }}>
                  {booking.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Progress steps */}
              {booking.status !== 'cancelled' && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.75rem' }}>
                  {statusSteps.map((step, i) => {
                    const done = i <= currentStep;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < statusSteps.length - 1 ? 1 : 'initial' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: done ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.05)', border: `2px solid ${done ? 'var(--accent-teal)' : 'var(--border-hairline)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={14} color={done ? 'var(--accent-teal)' : 'var(--text-muted)'} />
                          </div>
                          <span style={{ fontSize: '0.6rem', color: done ? 'var(--teal-text)' : 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: done ? '600' : '400', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{step.label}</span>
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div style={{ flex: 1, height: '2px', margin: '0 0.375rem 1.25rem', backgroundColor: i < currentStep ? 'var(--accent-teal)' : 'rgba(255,255,255,0.07)' }}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Order info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.8125rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-hairline)' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Customer</p>
                  <p style={{ fontWeight: '500' }}>{booking.customer?.[0]?.first_name || '—'} {booking.customer?.[0]?.last_name || ''}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Order Type</p>
                  <p style={{ fontWeight: '500' }}>{booking.booking_type === 'material' ? 'Material Delivery' : 'Truck Transport'}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Delivery Date</p>
                  <p className="number-font" style={{ fontWeight: '500' }}>{booking.delivery_date ? new Date(booking.delivery_date).toLocaleDateString() : '—'}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Charge</p>
                  <p className="number-font" style={{ fontWeight: '600', color: 'var(--status-success)' }}>{booking.estimated_price ? `₹${Number(booking.estimated_price).toLocaleString()}` : 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function TrackOrder() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-teal)' }} /></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
