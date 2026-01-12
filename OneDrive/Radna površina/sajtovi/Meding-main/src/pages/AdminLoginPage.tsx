import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAdmin } from '../lib/auth';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { roleData } = await login(email, password);
      
      // Proveri da li je admin
      if (!isAdmin(roleData)) {
        setError('Nemate admin pristup');
        return;
      }

      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Greška pri prijavi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      {/* Navbar-like header */}
      <nav className="admin-login-navbar">
        <div className="admin-login-navbar-container">
          <Link to="/" className="admin-login-logo">
            <img 
              src="/image/LOGO-MEDING-MO.png" 
              alt="Meding" 
              className="admin-login-logo-image"
            />
          </Link>
          <Link to="/" className="admin-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8z"/>
            </svg>
            Nazad na početnu
          </Link>
        </div>
      </nav>

      <div className="admin-login-content">
        <div className="admin-login-container">
          <div className="admin-login-header">
            <h1>Admin Pristup</h1>
            <p>Prijavite se sa vašim admin kredencijalima</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && <div className="admin-login-error">{error}</div>}

            <div className="admin-form-group">
              <label htmlFor="email">Email adresa</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
                placeholder="admin@meding.com"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">Lozinka</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? 'Prijavljivanje...' : 'Prijavi se'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

