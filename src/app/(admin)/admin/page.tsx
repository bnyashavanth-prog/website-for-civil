export default function AdminDashboardOverview() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'gray', marginBottom: '0.5rem' }}>Active Trips</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>12</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'gray', marginBottom: '0.5rem' }}>Pending Bookings</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>5</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'gray', marginBottom: '0.5rem' }}>Available Trucks</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>42 / 150</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'gray', marginBottom: '0.5rem' }}>Today's Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹1.2L</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Bookings</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'gray' }}>ID</th>
              <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'gray' }}>Customer</th>
              <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'gray' }}>Type</th>
              <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'gray' }}>Status</th>
              <th style={{ padding: '0.75rem 0', fontWeight: '500', color: 'gray' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0' }}>#BK-001</td>
              <td>Acme Corp</td>
              <td>M-Sand (100 Ton)</td>
              <td><span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#fef08a', color: '#854d0e', borderRadius: '4px', fontSize: '0.75rem' }}>Pending</span></td>
              <td><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>Review</button></td>
            </tr>
            <tr>
              <td style={{ padding: '1rem 0' }}>#BK-002</td>
              <td>Ravi Builders</td>
              <td>Truck Only (14 Wheel)</td>
              <td><span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#bfdbfe', color: '#1e40af', borderRadius: '4px', fontSize: '0.75rem' }}>In Progress</span></td>
              <td><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>Track</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
