"use client";
import { useState } from "react";
import { ArrowRight, Truck } from "lucide-react";

export default function TruckBooking() {
  const [formData, setFormData] = useState({
    capacity: '',
    materialType: '',
    location: '',
    date: ''
  });

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: '#f1f5f9', minHeight: '80vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Truck size={32} color="var(--primary)" /> Hire a Truck
        </h1>
        
        <div className="card">
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Truck Capacity Needed</label>
              <select className="input" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}>
                <option value="">-- Select Capacity --</option>
                <option value="10_wheel">10-Wheeler (approx. 16-20 Tons)</option>
                <option value="14_wheel">14-Wheeler (approx. 25-30 Tons)</option>
                <option value="16_wheel">16-Wheeler (approx. 35-40 Tons)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>What will you transport?</label>
              <input type="text" className="input" placeholder="e.g. Earth soil, gravel..." required value={formData.materialType} onChange={e => setFormData({...formData, materialType: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Pickup / Delivery Route</label>
              <textarea className="input" rows={2} placeholder="From Location A to Location B" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}></textarea>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Required Date & Time</label>
              <input type="datetime-local" className="input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            
            <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '1rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', marginTop: '1rem' }}>
              <strong>Note:</strong> You are requesting a truck type. Specific registration numbers and drivers will be assigned by our operations team upon confirmation to ensure optimal logistics.
            </div>

            <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>Submit Request <ArrowRight size={18} style={{ marginLeft: '0.5rem' }}/></button>
          </form>
        </div>
      </div>
    </div>
  );
}
