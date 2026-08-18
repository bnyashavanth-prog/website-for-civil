"use client";
import { useState } from "react";
import { ArrowRight, Truck, CheckCircle, Loader2 } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation";

export default function TruckBooking() {
  const [formData, setFormData] = useState({
    capacity: '',
    materialType: '',
    location: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const tenantId = '00000000-0000-0000-0000-000000000001';
      
      const { error: insertError } = await supabase.from('bookings').insert({
        tenant_id: tenantId,
        customer_id: user.id,
        booking_type: 'truck_only',
        quantity: formData.capacity, // Using quantity field for capacity for now
        delivery_location: formData.location,
        delivery_date: formData.date,
        status: 'pending'
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
      } else {
        setSubmitted(true);
        setLoading(false);
      }

    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '0.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Truck size={24} color="var(--accent-terracotta)" /> Hire a Truck
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '3rem' }}>Book specialized logistics for your materials.</p>
        
        <div className="card">
          {error && (
            <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid var(--status-danger)', color: 'var(--status-danger)', padding: '0.75rem', borderRadius: 'var(--radius-btn)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              ⚠ {error}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Truck Capacity Needed</label>
                <select className="input" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}>
                  <option value="">-- Select Capacity --</option>
                  <option value="10_wheel">10-Wheeler (approx. 16-20 Tons)</option>
                  <option value="14_wheel">14-Wheeler (approx. 25-30 Tons)</option>
                  <option value="16_wheel">16-Wheeler (approx. 35-40 Tons)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>What will you transport?</label>
                <input type="text" className="input" placeholder="e.g. Earth soil, gravel..." required value={formData.materialType} onChange={e => setFormData({...formData, materialType: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pickup / Delivery Route</label>
                <textarea className="input" rows={2} placeholder="From Location A to Location B" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}></textarea>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Required Date & Time</label>
                <input type="datetime-local" className="input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              
              <div style={{ backgroundColor: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent-teal)', padding: '1rem', borderRadius: 'var(--radius-btn)', fontSize: '0.875rem', marginTop: '1rem', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
                <strong>Note:</strong> You are requesting a truck capacity. Specific registration numbers and drivers will be assigned by our operations team upon confirmation.
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }}/> Submitting...</> : <>Submit Request <ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
               <CheckCircle size={48} color="var(--status-success)" style={{ margin: '0 auto', marginBottom: '1.5rem' }} />
               <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem' }}>Truck Requested</h2>
               <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                 Your transport request has been sent to fleet operations. We will assign a truck and estimate your pricing shortly.
               </p>
               <button className="btn btn-outline" onClick={() => router.push('/dashboard')}>Go to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
