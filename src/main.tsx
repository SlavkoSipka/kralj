import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import App from './App.tsx';
import Properties from './pages/Properties.tsx';
import Location from './pages/Location.tsx';
import VillaApartments from './pages/VillaApartments.tsx';
import Villa4Apartments from './pages/Villa4Apartments.tsx';
import ApartmentPage from './pages/ApartmentPage.tsx';
import RoyalAquaApartments from './pages/RoyalAquaApartments.tsx';
import CaseStudy from './pages/CaseStudy.tsx';
import BuildingPage from './pages/BuildingPage.tsx';
import { initTheme } from './lib/theme';
import './index.css';

initTheme();

const Admin = lazy(() => import('./pages/admin/Admin.tsx'));

/** Preusmerava /en/... na istu rutu bez prefiksa (klijentski fallback ako server ipak servira index.html). */
function EnPrefixRedirect() {
  const { '*': rest } = useParams();
  const target = rest ? `/${rest}` : '/';
  return <Navigate to={target} replace />;
}

// Google Analytics page tracking
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // @ts-ignore
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search
    });
  }, [location]);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <Router>
        <RouteTracker />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/location" element={<Location />} />
          <Route path="/villa-3" element={<BuildingPage slug="villa-3" fallback={<VillaApartments />} />} />
          <Route path="/villa-4" element={<BuildingPage slug="villa-4" fallback={<Villa4Apartments />} />} />
          <Route path="/vila-5" element={<BuildingPage slug="vila-5" />} />
          <Route path="/vila-5/:apartment" element={<ApartmentPage slug="vila-5" />} />
          <Route path="/royal-aqua" element={<BuildingPage slug="royal-aqua" fallback={<RoyalAquaApartments />} />} />
          <Route path="/zgrada/:slug" element={<BuildingPage />} />
          <Route path="/zgrada/:slug/:apartment" element={<ApartmentPage />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-royal-charcoal"><div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>}>
                <Admin />
              </Suspense>
            }
          />
          <Route path="/o-projektu" element={<CaseStudy />} />
          <Route path="/en" element={<Navigate to="/" replace />} />
          <Route path="/en/*" element={<EnPrefixRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  </StrictMode>
);
