import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, logout, isAdmin, type UserRoleData } from '../lib/auth';
import './AdminPanel.css';

export default function AdminPanel() {
  const [, setRoleData] = useState<UserRoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const data = await getCurrentUser();
      if (!data || !isAdmin(data.roleData)) {
        navigate('/admin/login');
        return;
      }
      setRoleData(data.roleData);
    } catch (error) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  if (loading) {
    return (
      <div className="admin-panel-loading">
        <div className="spinner"></div>
        <p>Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Navbar sa logom */}
      <nav className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/" className="admin-navbar-logo">
            <img 
              src="/image/LOGO-MEDING-MO.png" 
              alt="Meding" 
              className="admin-logo-image"
            />
          </Link>
          
          <div className="admin-navbar-menu">
            <span className="admin-badge">Admin Panel</span>
            <button onClick={handleLogout} className="logout-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H3zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                <path d="M10 8a.5.5 0 0 1-.5.5H5.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L5.707 7.5H9.5A.5.5 0 0 1 10 8z"/>
              </svg>
              Odjavi se
            </button>
          </div>
        </div>
      </nav>

      <main className="admin-content">
        <div className="admin-dashboard">
          <div className="admin-welcome">
            <h1>Dobrodošli u Admin Panel</h1>
            <p>Upravljajte celim Meding sistemom iz jednog mesta</p>
          </div>
          
          <div className="admin-cards">
            <Link to="/admin/vendors" className="admin-card admin-card-link">
              <div className="admin-card-icon">🏢</div>
              <h3>Vendori</h3>
              <p>Upravljanje dobavljačima i partnerima</p>
            </Link>
            <Link to="/admin/manufacturers" className="admin-card admin-card-link">
              <div className="admin-card-icon">🏭</div>
              <h3>Proizvođači</h3>
              <p>Upravljanje proizvođačima lekova</p>
            </Link>
            <Link to="/admin/categories" className="admin-card admin-card-link">
              <div className="admin-card-icon">📂</div>
              <h3>Kategorije</h3>
              <p>Upravljanje hijerarhijskim kategorijama</p>
            </Link>
            <Link to="/admin/generics" className="admin-card admin-card-link">
              <div className="admin-card-icon">💊</div>
              <h3>Generički Nazivi</h3>
              <p>Upravljanje generičkim nazivima lekova</p>
            </Link>
            <Link to="/admin/products" className="admin-card admin-card-link">
              <div className="admin-card-icon">📦</div>
              <h3>Proizvodi</h3>
              <p>Upravljanje proizvodima i cenama</p>
            </Link>
            <Link to="/admin/excel/vendors" className="admin-card admin-card-link">
              <div className="admin-card-icon">📊</div>
              <h3>Excel: Vendori</h3>
              <p>Import/export vendora iz Excel-a</p>
            </Link>
            <Link to="/admin/excel/manufacturers" className="admin-card admin-card-link">
              <div className="admin-card-icon">📊</div>
              <h3>Excel: Proizvođači</h3>
              <p>Import/export proizvođača iz Excel-a</p>
            </Link>
            <Link to="/admin/excel/products" className="admin-card admin-card-link">
              <div className="admin-card-icon">📊</div>
              <h3>Excel: Proizvodi</h3>
              <p>Import/export proizvoda iz Excel-a</p>
            </Link>
            <Link to="/admin/excel/product-variants" className="admin-card admin-card-link">
              <div className="admin-card-icon">📊</div>
              <h3>Excel: Varijante</h3>
              <p>Import varijanti proizvoda iz Excel-a</p>
            </Link>
            <Link to="/admin/algolia/sync-generics" className="admin-card admin-card-link">
              <div className="admin-card-icon">🔄</div>
              <h3>Algolia: Sync Generics</h3>
              <p>Sync generičke nazive u Algolia search</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

