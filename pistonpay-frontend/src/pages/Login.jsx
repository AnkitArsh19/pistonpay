import { useState } from 'react';
import { login, register } from '../api';

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = tab === 'login'
        ? await login({ username, password })
        : await register({ username, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ username: res.data.username, role: res.data.role, id: res.data.userId }));
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>PistonPay</h2>
        <div className="tabs">
          <button className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
          <button className={`tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {tab === 'register' && (
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} required>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
