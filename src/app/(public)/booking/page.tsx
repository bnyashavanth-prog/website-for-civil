"use client";
import { useState } from "react";
import { ArrowRight, MapPin, Calendar, CreditCard } from "lucide-react";

export default function MaterialBooking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    quantity: '',
    location: '',
    date: ''
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: '#f1f5f9', minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>Book Materials</h1>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
           <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: 'var(--border)', zIndex: 0 }}></div>
           {[1, 2, 3].map((s) => (
             <div key={s} style={{ 
               width: '32px', height: '32px', borderRadius: '50%', 
               backgroundColor: step >= s ? 'var(--primary)' : 'var(--card)', 
               color: step >= s ? 'white' : 'gray',
               border: `2px solid ${step >= s ? 'var(--primary)' : 'var(--border)'}`,
               display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, fontWeight: 'bold'
             }}>
               {s}
             </div>
           ))}
        </div>

        <div className="card">
          <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {step === 1 && (
              <>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>1. Select Material & Quantity</h2>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Material Category</label>
                  <select className="input" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">-- Select Category --</option>
                    <option value="sand">Sand</option>
                    <option value="aggregate">Aggregate (Stone)</option>
                    <option value="tar">Tar / Bitumen</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Specific Type</label>
                  <select className="input" required value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})}>
                    <option value="">-- Select Type --</option>
                    <option value="msand">M-Sand</option>
                    <option value="psand">P-Sand</option>
                    <option value="20mm">20mm Stone</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Quantity (Tons)</label>
                  <input type="number" min="10" className="input" placeholder="e.g. 50" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', marginTop: '1rem' }}>Next <ArrowRight size={18} style={{ marginLeft: '0.5rem' }}/></button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>2. Delivery Details</h2>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}><MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem' }}/> Delivery Address</label>
                  <textarea className="input" rows={3} placeholder="Full site address..." required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}><Calendar size={16} style={{ display: 'inline', marginRight: '0.25rem' }}/> Delivery Date & Time</label>
                  <input type="datetime-local" className="input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="btn btn-primary">Review <ArrowRight size={18} style={{ marginLeft: '0.5rem' }}/></button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>3. Confirm Booking</h2>
                <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Order Summary</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                    <p><span style={{ color: 'gray' }}>Material:</span><br/><b>{formData.subcategory || 'M-Sand'}</b></p>
                    <p><span style={{ color: 'gray' }}>Quantity:</span><br/><b>{formData.quantity || '50'} Tons</b></p>
                    <p><span style={{ color: 'gray' }}>Delivery:</span><br/><b>{formData.date || 'Tomorrow 10:00 AM'}</b></p>
                    <p><span style={{ color: 'gray' }}>Location:</span><br/><b>{formData.location || 'Site A'}</b></p>
                  </div>
                  <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>Estimated Total:</span>
                     <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{(Number(formData.quantity) * 1200) || '60,000'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                  <button type="button" className="btn btn-accent"><CreditCard size={18} style={{ marginRight: '0.5rem' }}/> Confirm & Pay Advance</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
