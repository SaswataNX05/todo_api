import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '85vh', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', color: '#384959' }}>
          Welcome Back
        </h2>
        <p style={{ color: '#6A89A7', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem', fontWeight: '500' }}>
          Sign in to access your task workspace
        </p>

        {error && (
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: 'var(--danger)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: '#384959' }}>Email</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: '#384959' }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#6A89A7' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#384959', textDecoration: 'none', fontWeight: '700' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;