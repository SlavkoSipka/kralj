import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/Navigation';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import { useScroll } from '../hooks/useScroll';
import { useParallax } from '../hooks/useParallax';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const CaseStudy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrolled, scrollPosition } = useScroll();
  const { calculateScale } = useParallax(scrollPosition);
  useIntersectionObserver();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update document title and meta tags
    document.title = 'O Projektu | Kralj Residence Vrnjačka Banja';
    
    // Update canonical
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://kraljresidence.rs/o-projektu');
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://kraljresidence.rs/o-projektu';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <NavigationBar scrolled={scrolled} />

      {/* Main Content */}
      <div className="relative pt-32 pb-32">
        {/* Background with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #D4AF37 1px, transparent 1px),
                linear-gradient(-45deg, #D4AF37 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 scroll-animate">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
              <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-sm font-light">O Projektu</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
            </div>
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl text-[#D4AF37] mb-6 font-serif opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
              style={{ fontFamily: 'Playfair Display' }}
            >
              Kako je Rađen Sajt
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6"></div>
          </div>

          {/* Content */}
          <div className="relative backdrop-blur-sm bg-gradient-to-br from-black/30 via-black/20 to-black/10 p-8 md:p-12 rounded-lg border border-[#D4AF37]/10 mb-12 scroll-animate delay-200">
            <div className="space-y-8 text-cream-100/90 text-lg leading-relaxed">
              
              {/* Introduction */}
              <div>
                <h2 className="text-2xl md:text-3xl text-[#D4AF37] mb-6 font-serif" style={{ fontFamily: 'Playfair Display' }}>
                  O Klijentu
                </h2>
                <p className="mb-6">
                  Kralj Residence je vodeća kompanija za gradnju i prodaju luksuznih stambenih kompleksa u Vrnjačkoj Banji. 
                  Sa preko 15 godina iskustva u nekretninama, kompanija je stekla izuzetnu reputaciju za kvalitet, 
                  pažljivo odabrane lokacije i vrhunski standard gradnje. Kralj Residence nudi ekskluzivne stanove, 
                  apartmane i vile u nekoliko prestižnih kompleksa, uključujući Kralj Residence Resort i Royal Aqua.
                </p>
                <p className="mb-6">
                  Kompanija je deo Kralj doo grupe, koja već tri decenije uspešno posluje u ugostiteljstvu i turizmu, 
                  sa prestižnim hotelom Kralj koji je prisutan na tržištu skoro 20 godina. Ovo bogato iskustvo 
                  u ugostiteljstvu i turizmu direktno se reflektuje u pristupu gradnji stambenih kompleksa, 
                  gde se pažnja posvećuje svakom detalju kako bi se stvorio luksuzan ambijent za život.
                </p>
              </div>

              {/* Goals */}
              <div>
                <h2 className="text-2xl md:text-3xl text-[#D4AF37] mb-6 font-serif" style={{ fontFamily: 'Playfair Display' }}>
                  Cilj Sajta
                </h2>
                <p className="mb-6">
                  Glavni cilj sajta bio je kreiranje moderne, profesionalne digitalne prezentacije koja će efikasno 
                  predstaviti kompletnu ponudu Kralj Residence nekretnina. Sajt je trebalo da omogući potencijalnim 
                  kupcima da lako pronađu informacije o dostupnim stanovima, apartmanima i vilama, pregledaju detaljne 
                  specifikacije svake jedinice i direktno kontaktiraju tim za prodaju.
                </p>
                <p className="mb-6">
                  Dodatno, važan cilj bio je osigurati da sajt odražava luksuzan karakter brenda i pruža vrhunsko 
                  korisničko iskustvo koje će inspirisati poverenje kod potencijalnih kupaca. Sajt je takođe trebalo 
                  da bude optimizovan za pretraživače kako bi se osigurala maksimalna vidljivost u Google pretrazi 
                  za relevantne ključne reči vezane za nekretnine u Vrnjačkoj Banji.
                </p>
              </div>

              {/* What Was Done */}
              <div>
                <h2 className="text-2xl md:text-3xl text-[#D4AF37] mb-6 font-serif" style={{ fontFamily: 'Playfair Display' }}>
                  Šta je Rađeno
                </h2>
                <p className="mb-6">
                  Projektat je započet detaljnom analizom potreba klijenta i konkurentskog tržišta. Tim <a href="https://aisajt.com" className="text-[#D4AF37] hover:text-[#E5C048] transition-colors underline">AiSajt</a> je 
                  razvio kompletan dizajn koncept koji kombinuje elegantan, luksuzan vizuelni identitet sa funkcionalnom 
                  strukturom. Dizajn je inspirisan premium nekretninama i koristi zlatne akcente (#D4AF37) koji odgovaraju 
                  brend identitetu Kralj Residence.
                </p>
                <p className="mb-6">
                  Za razvoj sajta korišćen je React sa TypeScript-om, što je omogućilo kreiranje brzog, interaktivnog 
                  korisničkog interfejsa. Implementirana je responzivna verzija koja savršeno funkcioniše na svim uređajima, 
                  od mobilnih telefona do desktop računara. Sajt uključuje dinamičke galerije slika, interaktivne mape lokacije, 
                  kontakt formu sa validacijom i višejezičnu podršku (srpski i engleski).
                </p>
                <p className="mb-6">
                  Posebna pažnja posvećena je <a href="https://aisajt.com/seo" className="text-[#D4AF37] hover:text-[#E5C048] transition-colors underline">SEO optimizaciji sajta</a>. 
                  Implementirani su strukturirani podaci (Schema.org) za nekretnine, optimizovani meta tagovi, 
                  semantički HTML, brzo vreme učitavanja i tehnička optimizacija koja osigurava da sajt bude lako 
                  indeksiran od strane pretraživača. Sajt takođe uključuje robots.txt, sitemap.xml i optimizovane 
                  slike za brže učitavanje.
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-2xl md:text-3xl text-[#D4AF37] mb-6 font-serif" style={{ fontFamily: 'Playfair Display' }}>
                  Konkretni Benefiti
                </h2>
                <p className="mb-6">
                  Jedan od najznačajnijih rezultata je drastično poboljšanje brzine učitavanja sajta. Optimizacijom slika, 
                  korišćenjem modernih web tehnologija i efikasnim kodom, sajt se učitava za manje od 2 sekunde, 
                  što značajno poboljšava korisničko iskustvo i pozitivno utiče na SEO rangiranje.
                </p>
                <p className="mb-6">
                  Korisnički interfejs je dizajniran sa fokusom na intuitivnu navigaciju i jednostavno pronalaženje 
                  informacija. Potencijalni kupci mogu lako filtrirati stanove po tipu, veličini i lokaciji, pregledati 
                  detaljne specifikacije svake jedinice i direktno kontaktirati tim za prodaju kroz optimizovanu 
                  kontakt formu. Ovo je rezultiralo povećanjem broja kvalitetnih upita i konverzija.
                </p>
                <p className="mb-6">
                  SEO optimizacija je donela merljive rezultate u vidu poboljšanja pozicija u Google pretrazi za 
                  ključne reči vezane za nekretnine u Vrnjačkoj Banji. Sajt sada ima bolju vidljivost za relevantne 
                  pretrage, što direktno utiče na povećanje organskog saobraćaja i kvalitetnih leadova.
                </p>
              </div>

              {/* Conclusion */}
              <div>
                <h2 className="text-2xl md:text-3xl text-[#D4AF37] mb-6 font-serif" style={{ fontFamily: 'Playfair Display' }}>
                  Zaključak
                </h2>
                <p className="mb-6">
                  Uspešna saradnja sa <a href="https://aisajt.com" className="text-[#D4AF37] hover:text-[#E5C048] transition-colors underline">AiSajt timom</a> rezultirala je 
                  kreiranjem moderne, profesionalne digitalne prezentacije koja efikasno predstavlja Kralj Residence 
                  brend i njegovu ponudu nekretnina. Kombinacija vrhunskog dizajna, tehničke izvrsnosti i SEO optimizacije 
                  osigurala je da sajt ne samo da izgleda impresivno, već i da donosi konkretne poslovne rezultate.
                </p>
                <p>
                  Sajt je postao ključan alat za prodaju nekretnina, omogućavajući kompaniji da efikasno komunicira 
                  sa potencijalnim kupcima i prezentuje svoju ponudu na način koji odražava luksuzan karakter brenda. 
                  Kontinuirana podrška i održavanje osiguravaju da sajt ostane ažuran i funkcionalan, prateći potrebe 
                  rastućeg poslovanja.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CaseStudy;

