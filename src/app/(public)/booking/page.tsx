"use client";
import { useState } from "react";
import { ArrowRight, MapPin, Calendar, CheckCircle, Package } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation";

export default function MaterialBooking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    quantity: '',
    location: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
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
        booking_type: 'material',
        quantity: formData.quantity,
        delivery_location: formData.location,
        delivery_date: formData.date,
        status: 'pending'
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
      } else {
        setStep(4);
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
        
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Package size={24} color="var(--accent-amber)" /> Book Material
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Submit your requirements for material and transport</p>
        </div>
        
        {/* Flat Progress Indicator */}
        {step < 4 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
             {[1, 2, 3].map((s) => (
               <div key={s} style={{ 
                 flex: 1, 
                 height: '4px', 
                 borderRadius: '2px', 
                 backgroundColor: step >= s ? 'var(--accent-amber)' : 'var(--bg-surface)',
                 transition: 'background-color 0.2s ease'
               }}></div>
             ))}
          </div>
        )}

        <div className="card">
          {error && (
            <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid var(--status-danger)', color: 'var(--status-danger)', padding: '0.75rem', borderRadius: 'var(--radius-btn)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              ⚠ {error}
            </div>
          )}

          {step < 4 ? (
            <form onSubmit={step === 3 ? handlePlaceOrder : handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {step === 1 && (
                <>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '500' }}>1. Material Details</h2>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Material Category</label>
                    <select className="input" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="">-- Select Category --</option>
                      <option value="sand">Sand</option>
                      <option value="aggregate">Aggregate (Stone)</option>
                      <option value="tar">Tar / Bitumen</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Specific Type</label>
                    <select className="input" required value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})}>
                      <option value="">-- Select Type --</option>
                      <option value="msand">M-Sand</option>
                      <option value="psand">P-Sand</option>
                      <option value="20mm">20mm Stone</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Quantity (Tons)</label>
                    <input type="number" min="10" className="input" placeholder="e.g. 50" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">Next <ArrowRight size={16} style={{ marginLeft: '0.5rem' }}/></button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '500' }}>2. Delivery Details</h2>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-secondary)' }}><MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }}/> Delivery Address</label>
                    <textarea className="input" rows={3} placeholder="Full site address..." required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-secondary)' }}><Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }}/> Delivery Date & Time</label>
                    <input type="datetime-local" className="input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                    <button type="submit" className="btn btn-primary">Review <ArrowRight size={16} style={{ marginLeft: '0.5rem' }}/></button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '500' }}>3. Review Request</h2>
                  <div style={{ backgroundColor: 'var(--bg-base)', padding: '1.25rem', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.875rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Material</span><br/>
                        <span style={{ fontWeight: '500' }}>{formData.subcategory || 'M-Sand'}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Quantity</span><br/>
                        <span className="number-font">{formData.quantity || '50'} Tons</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Delivery</span><br/>
                        <span className="number-font">{formData.date || 'Tomorrow 10:00 AM'}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Location</span><br/>
                        <span style={{ fontWeight: '500' }}>{formData.location || 'Site A'}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--status-warning)', fontSize: '0.875rem', padding: '0.75rem', backgroundColor: 'rgba(242, 169, 84, 0.1)', borderRadius: 'var(--radius-btn)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Upon submission, dispatch will review and provide a final price estimate.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Submitting...' : 'Place Request'}
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
               <CheckCircle size={48} color="var(--status-success)" style={{ margin: '0 auto', marginBottom: '1.5rem' }} />
               <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem' }}>Request Submitted</h2>
               <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                 Your material request has been securely routed to dispatch. We will assign a truck and estimate your pricing shortly.
               </p>
               <button className="btn btn-outline" onClick={() => router.push('/dashboard')}>Go to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
