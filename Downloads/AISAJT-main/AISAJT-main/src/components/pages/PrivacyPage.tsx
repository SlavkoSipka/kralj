import React from 'react';
import { Brain } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="fixed w-full z-50 bg-gray-900 nav-blur shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="text-white font-display font-bold text-xl md:text-2xl flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-400" />
              <span className="gradient-text">AI Sajt</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Politika Privatnosti</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">1. Uvod</h2>
              <p>
                AI Sajt je posvećen zaštiti vaše privatnosti. Ova politika privatnosti objašnjava kako prikupljamo, koristimo i štitimo vaše lične podatke.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">2. Koje podatke prikupljamo</h2>
              <p>Prikupljamo sledeće podatke:</p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Ime i prezime</li>
                <li>Email adresa</li>
                <li>Broj telefona</li>
                <li>Informacije o projektu</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">3. Kako koristimo vaše podatke</h2>
              <p>Vaše podatke koristimo za:</p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Komunikaciju u vezi sa vašim projektom</li>
                <li>Pružanje usluga izrade web sajta</li>
                <li>Slanje važnih obaveštenja</li>
                <li>Unapređenje naših usluga</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">4. Zaštita podataka</h2>
              <p>
                Primenjujemo stroge mere zaštite kako bismo osigurali bezbednost vaših podataka. Vaši podaci se čuvaju na sigurnim serverima i pristup njima imaju samo ovlašćena lica.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">5. Kolačići (Cookies)</h2>
              <p>
                Naš sajt koristi kolačiće kako bi poboljšao vaše korisničko iskustvo. Možete podesiti svoj pretraživač da odbije kolačiće, ali to može uticati na funkcionalnost sajta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">6. Vaša prava</h2>
              <p>Imate pravo da:</p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Pristupite svojim podacima</li>
                <li>Ispravite netačne podatke</li>
                <li>Zatražite brisanje podataka</li>
                <li>Povučete saglasnost za obradu podataka</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">7. Kontakt</h2>
              <p>
                Za sva pitanja u vezi sa zaštitom privatnosti, možete nas kontaktirati na email: office@aisajt.com
              </p>
            </section>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Poslednje ažuriranje: 15. Februar 2024.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}