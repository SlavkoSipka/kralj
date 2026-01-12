import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import App from './App.tsx';
import Properties from './pages/Properties.tsx';
import Location from './pages/Location.tsx';
import VillaApartments from './pages/VillaApartments.tsx';
import Villa4Apartments from './pages/Villa4Apartments.tsx';
import RoyalAquaApartments from './pages/RoyalAquaApartments.tsx';
import CaseStudy from './pages/CaseStudy.tsx';
import './index.css';

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
          <Route path="/villa-3" element={<VillaApartments />} />
          <Route path="/villa-4" element={<Villa4Apartments />} />
          <Route path="/royal-aqua" element={<RoyalAquaApartments />} />
          <Route path="/o-projektu" element={<CaseStudy />} />
        </Routes>
      </Router>
    </LanguageProvider>
  </StrictMode>
);
