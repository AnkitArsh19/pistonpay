import { NavLink, Outlet } from 'react-router-dom';

export default function Layout({ user, onLogout }) {
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="app">
      <nav className="sidebar">
        <h2>PistonPay</h2>
        
        {isAdmin ? (
          <>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/customers">Customers</NavLink>
            <NavLink to="/vehicles">Vehicles</NavLink>
            <NavLink to="/rentals">Rentals</NavLink>
            <NavLink to="/invoices">Invoices</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/profile">My Profile</NavLink>
            <NavLink to="/vehicles">Available Vehicles</NavLink>
            <NavLink to="/rentals">My Rentals</NavLink>
            <NavLink to="/invoices">My Invoices</NavLink>
          </>
        )}

        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid #2a2a2a', fontSize: 13, color: '#888' }}>
          <div>{user?.username}</div>
          <div style={{ fontSize: 11, marginBottom: 8, textTransform: 'uppercase' }}>{user?.role}</div>
          <button className="btn btn-outline" style={{ width: '100%', padding: '6px' }} onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
