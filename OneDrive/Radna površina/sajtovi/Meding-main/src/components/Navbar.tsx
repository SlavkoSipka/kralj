import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src="/image/LOGO-MEDING-MO.png" 
            alt="Meding" 
            className="logo-image"
            onError={(e) => {
              // Fallback to text if image fails to load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.logo-text-fallback')) {
                const span = document.createElement('span');
                span.className = 'logo-text-fallback';
                span.textContent = 'Meding';
                parent.appendChild(span);
              }
            }}
          />
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Početna</Link>
          <Link to="/rezultati?q=" className="navbar-link">Proizvodi</Link>
          <a href="#kontakt" className="navbar-link">Kontakt</a>
          <a href="#o-nama" className="navbar-link">O nama</a>
          <Link to="/admin/login" className="navbar-link navbar-admin-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.93 11.93C11.75 10.75 10.13 10 8 10s-3.75.75-4.93 1.93A6.97 6.97 0 008 14c2.39 0 4.49-1.2 5.93-3.07z"/>
            </svg>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

