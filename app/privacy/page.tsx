import Link from 'next/link';

export const metadata = {
  title: 'Politika privatnosti - Jugofilm.online',
  description: 'Politika privatnosti i zaštite podataka za Jugofilm.online',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <header className="bg-neutral-950 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-yellow-500 hover:text-yellow-400 transition-colors text-sm">
            ← Nazad na početnu
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-yellow-500 mb-8">Politika privatnosti</h1>
        
        <div className="prose prose-invert prose-neutral max-w-none space-y-8">
          <section>
            <p className="text-neutral-300 text-sm mb-8">
              <strong>Poslednje ažuriranje:</strong> 14. decembar 2024.
            </p>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 mb-8">
              <p className="text-neutral-300 leading-relaxed">
                Jugofilm.online poštuje vašu privatnost. Ova stranica objašnjava kako prikupljamo, 
                koristimo i štitimo vaše lične podatke u skladu sa <strong>Opštom uredbom o zaštiti podataka (GDPR)</strong>.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">1. Rukovalac podacima</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <p className="text-neutral-300">
                <strong>Jugofilm.online</strong><br />
                Email: <a href="mailto:privacy@jugofilm.online" className="text-yellow-500 hover:text-yellow-400">privacy@jugofilm.online</a>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">2. Podaci koje prikupljamo</h2>
            <div className="space-y-4">
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">2.1 Podaci o korišćenju sajta</h3>
                <p className="text-neutral-300 mb-3">
                  Koristimo <strong>Google Analytics</strong> za analizu korišćenja sajta. Ovi podaci uključuju:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-300">
                  <li>IP adresu (anonimizovanu)</li>
                  <li>Tip pregledača i operativni sistem</li>
                  <li>Stranice koje posetite i vreme provedeno na sajtu</li>
                  <li>Izvor dolaska na sajt (referer URL)</li>
                  <li>Geografska lokacija (na nivou zemlje/grada)</li>
                </ul>
              </div>

              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">2.2 Kolačići (Cookies)</h3>
                <p className="text-neutral-300 mb-3">
                  Koristimo kolačiće za:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-300">
                  <li><strong>Analitiku:</strong> Google Analytics kolačići za praćenje korišćenja sajta</li>
                  <li><strong>Oglašavanje:</strong> Google AdSense kolačići za prikaz relevantnih oglasa</li>
                  <li><strong>Funkcionalnost:</strong> Pamćenje vaših postavki i preferenci</li>
                </ul>
              </div>

              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">2.3 Podaci koje ne prikupljamo</h3>
                <ul className="list-disc list-inside space-y-2 text-neutral-300">
                  <li>Ne zahtevamo registraciju ili otvaranje naloga</li>
                  <li>Ne prikupljamo lične podatke kao što su ime, email, telefonski broj</li>
                  <li>Ne prikupljamo podatke o plaćanju</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">3. Kako koristimo vaše podatke</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <p className="text-neutral-300 mb-3">Prikupljene podatke koristimo za:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>Unapređenje funkcionalnosti i korisničkog iskustva sajta</li>
                <li>Analizu statistike posećenosti i ponašanja korisnika</li>
                <li>Prikaz relevantnih oglasa putem Google AdSense</li>
                <li>Tehnički rad i održavanje sajta</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">4. Deljenje podataka sa trećim stranama</h2>
            <div className="space-y-4">
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Google Analytics</h3>
                <p className="text-neutral-300">
                  Google Analytics obrađuje podatke u naše ime. Google može koristiti ove podatke 
                  za poboljšanje svojih usluga. Za više informacija pogledajte{' '}
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 underline"
                  >
                    Google Privacy Policy
                  </a>.
                </p>
              </div>

              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Google AdSense</h3>
                <p className="text-neutral-300">
                  Google AdSense prikazuje oglase na našem sajtu i koristi kolačiće za personalizaciju 
                  oglasa na osnovu vaših preferencija. Za više informacija pogledajte{' '}
                  <a 
                    href="https://policies.google.com/technologies/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 underline"
                  >
                    Google Ads Privacy Policy
                  </a>.
                </p>
              </div>

              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">TMDb API</h3>
                <p className="text-neutral-300">
                  Koristimo TMDb (The Movie Database) API za prikupljanje informacija o filmovima. 
                  Vaši zahtevi prema TMDb-u podležu njihovoj politici privatnosti.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">5. Vaša prava prema GDPR-u</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <p className="text-neutral-300 mb-3">Prema GDPR-u imate sledeća prava:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li><strong>Pravo na pristup:</strong> Možete zatražiti kopiju podataka koje imamo o vama</li>
                <li><strong>Pravo na ispravku:</strong> Možete zatražiti ispravku netačnih podataka</li>
                <li><strong>Pravo na brisanje:</strong> Možete zatražiti brisanje vaših podataka</li>
                <li><strong>Pravo na ograničenje obrade:</strong> Možete zatražiti ograničenje obrade vaših podataka</li>
                <li><strong>Pravo na prenosivost:</strong> Možete zatražiti podatke u prenosivom formatu</li>
                <li><strong>Pravo na prigovor:</strong> Možete se usprotiviti obradi vaših podataka</li>
              </ul>
              <p className="text-neutral-300 mt-4">
                Da biste ostvarili ova prava, kontaktirajte nas na:{' '}
                <a href="mailto:privacy@jugofilm.online" className="text-yellow-500 hover:text-yellow-400">
                  privacy@jugofilm.online
                </a>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">6. Upravljanje kolačićima</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <p className="text-neutral-300 mb-3">
                Možete kontrolisati i brisati kolačiće putem postavki vašeg pregledača:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>
                  <strong>Chrome:</strong>{' '}
                  <a 
                    href="https://support.google.com/chrome/answer/95647" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 underline"
                  >
                    Upravljanje kolačićima
                  </a>
                </li>
                <li>
                  <strong>Firefox:</strong>{' '}
                  <a 
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 underline"
                  >
                    Upravljanje kolačićima
                  </a>
                </li>
                <li>
                  <strong>Safari:</strong>{' '}
                  <a 
                    href="https://support.apple.com/en-us/HT201265" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 underline"
                  >
                    Upravljanje kolačićima
                  </a>
                </li>
              </ul>
              <p className="text-neutral-300 mt-4">
                <strong>Napomena:</strong> Blokiranje kolačića može uticati na funkcionalnost sajta.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">7. Bezbednost podataka</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <p className="text-neutral-300">
                Primenjujemo tehničke i organizacione mere za zaštitu vaših podataka od neovlašćenog 
                pristupa, gubitka ili zloupotrebe. Naš sajt koristi HTTPS enkripciju za bezbedno 
                prenošenje podataka.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">8. Dečja privatnost</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <p className="text-neutral-300">
                Naš sajt nije namenjen deci mlađoj od 16 godina. Ne prikupljamo svesno podatke od dece. 
                Ako ste roditelj ili staratelj i smatrate da je vaše dete podelilo lične podatke, 
                kontaktirajte nas.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">9. Izmene politike privatnosti</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <p className="text-neutral-300">
                Zadržavamo pravo da ažuriramo ovu politiku privatnosti. Sve izmene će biti objavljene 
                na ovoj stranici sa ažuriranim datumom. Preporučujemo da povremeno proveravate ovu stranicu.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">10. Kontakt</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <p className="text-neutral-300 mb-3">
                Za pitanja o ovoj politici privatnosti ili ostvarivanju vaših prava, kontaktirajte nas:
              </p>
              <p className="text-neutral-300">
                Email: <a href="mailto:privacy@jugofilm.online" className="text-yellow-500 hover:text-yellow-400">privacy@jugofilm.online</a>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">11. Nadzorni organ</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <p className="text-neutral-300">
                Imate pravo da podnesete pritužbu nadležnom organu za zaštitu podataka u vašoj zemlji 
                ako smatrate da su vaša prava prekršena.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-950 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Link href="/" className="text-yellow-500 hover:text-yellow-400 transition-colors">
              Nazad na početnu
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
