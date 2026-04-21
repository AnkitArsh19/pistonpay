import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">PistonPay</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/vehicles">Vehicles</Link></li>
        <li><Link to="/customers">Customers</Link></li>
        <li><Link to="/rentals">Rentals</Link></li>
        <li><Link to="/invoices">Invoices</Link></li>
        <li><Link to="/profile">My Profile</Link></li>
        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
