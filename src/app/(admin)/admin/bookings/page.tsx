"use client";
import { useState } from "react";
import { Check, X, Truck, Calendar, MapPin } from "lucide-react";

export default function AdminBookings() {
  const [bookings] = useState([
    { id: 'BK-001', customer: 'Acme Corp', type: 'Material (M-Sand)', qty: '100 Ton', date: '2024-03-10', location: 'Site Alpha', status: 'pending', price: '₹1,20,000' },
    { id: 'BK-002', customer: 'Ravi Builders', type: 'Truck Only', qty: '14 Wheel', date: '2024-03-11', location: 'Route B to C', status: 'pending', price: '₹15,000' },
    { id: 'BK-003', customer: 'L&T', type: 'Material (20mm Stone)', qty: '500 Ton', date: '2024-03-12', location: 'Metro Site', status: 'confirmed', price: '₹4,75,000' }
  ]);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Manage Bookings & Dispatch</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn btn-primary">Pending (2)</button>
        <button className="btn btn-outline">Confirmed (1)</button>
        <button className="btn btn-outline">Active Trips (12)</button>
        <button className="btn btn-outline">Completed</button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {bookings.map(booking => (
          <div key={booking.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{booking.id} - {booking.customer}</h3>
                <span style={{ padding: '0.25rem 0.5rem', backgroundColor: booking.status === 'pending' ? '#fef08a' : '#bfdbfe', color: booking.status === 'pending' ? '#854d0e' : '#1e40af', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500' }}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '2rem', color: 'gray', fontSize: '0.875rem', marginBottom: '1rem' }}>
                 <p><strong>Type:</strong> {booking.type} ({booking.qty})</p>
                 <p><Calendar size={14} style={{ display: 'inline' }}/> {booking.date}</p>
                 <p><MapPin size={14} style={{ display: 'inline' }}/> {booking.location}</p>
                 <p><strong>Est. Value:</strong> {booking.price}</p>
              </div>

              {booking.status === 'pending' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'inline-block' }}>
                  <p style={{ fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Dispatch Assignment</p>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select className="input" style={{ width: '200px' }}>
                       <option value="">Assign Truck...</option>
                       <option value="t1">KA-01-AB-1234 (10 Wheel)</option>
                       <option value="t2">KA-01-XY-9876 (14 Wheel)</option>
                    </select>
                    <select className="input" style={{ width: '200px' }}>
                       <option value="">Assign Driver...</option>
                       <option value="d1">Ramesh Kumar</option>
                       <option value="d2">Suresh Singh</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {booking.status === 'pending' ? (
                <>
                  <button className="btn btn-primary"><Check size={16} style={{ marginRight: '0.5rem' }}/> Approve & Dispatch</button>
                  <button className="btn btn-outline" style={{ color: 'red', borderColor: 'red' }}><X size={16} style={{ marginRight: '0.5rem' }}/> Reject Booking</button>
                </>
              ) : (
                <button className="btn btn-outline"><Truck size={16} style={{ marginRight: '0.5rem' }}/> Live Tracking</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
