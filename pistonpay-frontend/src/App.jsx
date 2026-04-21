import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import Rentals from './pages/Rentals';
import Invoices from './pages/Invoices';
import MyProfile from './pages/MyProfile';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (data) => {
    setUser({ username: data.username, role: data.role, id: data.userId });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          {user.role === 'ADMIN' ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/profile" />} />
              <Route path="/profile" element={<MyProfile user={user} />} />
            </>
          )}
          <Route path="/vehicles" element={<Vehicles user={user} />} />
          <Route path="/rentals" element={<Rentals user={user} />} />
          <Route path="/invoices" element={<Invoices user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
