import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        backgroundColor: '#BAE2C5',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle organic ambient highlights over #BAE2C5 */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-8%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-12%',
          right: '-8%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46, 111, 64, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card elevated against #BAE2C5 */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem',
          background: '#edfbe8',
          borderRadius: '16px',
          border: '1.5px solid rgba(46, 111, 64, 0.25)',
          boxShadow: '0 16px 36px rgba(37, 61, 44, 0.12), 0 4px 12px rgba(37, 61, 44, 0.06)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: '#BAE2C5',
              color: '#182B1E',
              padding: '4px 14px',
              borderRadius: '20px',
              border: '1px solid #68BA7F',
            }}
          >
            Get Started
          </span>
        </div>

        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            marginBottom: '0.4rem',
            textAlign: 'center',
            color: '#182B1E',
          }}
        >
          Create Account
        </h2>
        <p
          style={{
            color: '#2E6F40',
            fontSize: '0.92rem',
            textAlign: 'center',
            marginBottom: '2rem',
            fontWeight: '600',
          }}
        >
          Join to organize your tasks and stay productive
        </p>

        {error && (
          <div
            style={{
              background: '#FFF0F2',
              border: '1.5px solid #FECDD3',
              color: '#9F1239',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '0.4rem',
                color: '#182B1E',
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Saswata"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1.5px solid #68BA7F',
                borderRadius: '10px',
                fontSize: '0.95rem',
                outline: 'none',
                color: '#182B1E',
                background: '#F5FCF7',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.background = '#FFFFFF';
                e.target.style.borderColor = '#2E6F40';
                e.target.style.boxShadow = '0 0 0 3px rgba(186, 226, 197, 0.6)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#F5FCF7';
                e.target.style.borderColor = '#68BA7F';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '0.4rem',
                color: '#182B1E',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1.5px solid #68BA7F',
                borderRadius: '10px',
                fontSize: '0.95rem',
                outline: 'none',
                color: '#182B1E',
                background: '#F5FCF7',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.background = '#FFFFFF';
                e.target.style.borderColor = '#2E6F40';
                e.target.style.boxShadow = '0 0 0 3px rgba(186, 226, 197, 0.6)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#F5FCF7';
                e.target.style.borderColor = '#68BA7F';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '0.4rem',
                color: '#182B1E',
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1.5px solid #68BA7F',
                borderRadius: '10px',
                fontSize: '0.95rem',
                outline: 'none',
                color: '#182B1E',
                background: '#F5FCF7',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.background = '#FFFFFF';
                e.target.style.borderColor = '#2E6F40';
                e.target.style.boxShadow = '0 0 0 3px rgba(186, 226, 197, 0.6)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#F5FCF7';
                e.target.style.borderColor = '#68BA7F';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '0.4rem',
                color: '#182B1E',
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1.5px solid #68BA7F',
                borderRadius: '10px',
                fontSize: '0.95rem',
                outline: 'none',
                color: '#182B1E',
                background: '#F5FCF7',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.background = '#FFFFFF';
                e.target.style.borderColor = '#2E6F40';
                e.target.style.boxShadow = '0 0 0 3px rgba(186, 226, 197, 0.6)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#F5FCF7';
                e.target.style.borderColor = '#68BA7F';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.85rem 1.4rem',
              background: '#253D2C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(24, 43, 30, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.background = '#2E6F40';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.background = '#253D2C';
              }
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p
          style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            color: '#2E6F40',
            fontWeight: '600',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#182B1E',
              textDecoration: 'none',
              fontWeight: '800',
              borderBottom: '2px solid #68BA7F',
              paddingBottom: '1px',
            }}
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;