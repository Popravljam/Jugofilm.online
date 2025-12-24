import Link from 'next/link';
import { getMoviesWithCast } from '@/lib/queries';
import YearStats from '@/components/YearStats';
import AdUnit from '@/components/AdUnit';

// Always render this page dynamically so stats follow DB updates immediately
export const dynamic = 'force-dynamic';

// Helper function for Serbian plural forms
function filmPlural(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count.toLocaleString('sr-RS')} filmova`;
  }
  
  if (lastDigit === 1) {
    return `${count.toLocaleString('sr-RS')} film`;
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count.toLocaleString('sr-RS')} filma`;
  }
  
  return `${count.toLocaleString('sr-RS')} filmova`;
}

export default async function Home() {
  // Load data from SQLite
  const allMovies = getMoviesWithCast();

  const movies = { length: allMovies.length } as any;
  
  // Build actor index
  const actorMoviesMap = new Map<string, number[]>();
  for (const movie of allMovies) {
    if (movie.cast && Array.isArray(movie.cast)) {
      for (const actor of movie.cast) {
        if (!actorMoviesMap.has(actor.name)) {
          actorMoviesMap.set(actor.name, []);
        }
        actorMoviesMap.get(actor.name)!.push(movie.id);
      }
    }
  }
  
  const allActors = Array.from(actorMoviesMap.entries()).map(([name, movieIds]) => ({
    name,
    movieIds
  }));
  
  const actors = { length: allActors.length } as any;

  // roles
  const rolesCount = allMovies.reduce((sum, m) => sum + (Array.isArray(m.cast) ? m.cast.length : 0), 0);

  // top actors
  const topActors = [...allActors]
    .map((a: any) => ({ name: a.name, movies: a.movieIds.length }))
    .sort((a, b) => b.movies - a.movies || a.name.localeCompare(b.name))
    .slice(0, 10);

  // top pairs (actors together)
  const pairCounts = new Map<string, number>();
  const norm = (s: string) => s.trim();
  for (const m of allMovies) {
    const names: string[] = Array.from(new Set((m.cast || []).map((c: any) => norm(c.name)).filter(Boolean)));
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const a = names[i], b = names[j];
        const key = a < b ? `${a}|||${b}` : `${b}|||${a}`;
        pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
      }
    }
  }
  const topPairs = Array.from(pairCounts.entries())
    .map(([k, count]) => { const [a,b] = k.split('|||'); return { a, b, movies: count }; })
    .sort((x, y) => y.movies - x.movies || (x.a + x.b).localeCompare(y.a + y.b))
    .slice(0, 10);

  // Najčešće saradnje glumac–režiser: top 10 parova
  const actorDirectorCounts = new Map<string, number>();
  for (const m of allMovies) {
    const dirs: string[] = Array.isArray(m.directors) ? m.directors : [];
    if (!dirs.length || !Array.isArray(m.cast)) continue;
    const names = Array.from(new Set(m.cast.map((c: any) => (c.name || '').trim()).filter(Boolean)));
    for (const d of dirs) {
      for (const a of names) {
        const key = `${a}|||${d}`;
        actorDirectorCounts.set(key, (actorDirectorCounts.get(key) || 0) + 1);
      }
    }
  }
  const topActorDirector = Array.from(actorDirectorCounts.entries())
    .map(([k, count]) => { const [a, d] = k.split('|||'); return { actor: a, director: d, movies: count }; })
    .sort((x,y)=> y.movies - x.movies || (x.actor + x.director).localeCompare(y.actor + y.director))
    .slice(0, 10);

  // Najproduktivniji režiseri: top 10 režisera po broju filmova
  const directorCounts = new Map<string, number>();
  for (const m of allMovies) {
    const dirs: string[] = Array.isArray(m.directors) ? m.directors : [];
    for (const d of dirs) {
      if (d) directorCounts.set(d, (directorCounts.get(d) || 0) + 1);
    }
  }
  const topDirectors = Array.from(directorCounts.entries())
    .map(([name, count]) => ({ name, movies: count }))
    .sort((a, b) => b.movies - a.movies || a.name.localeCompare(b.name))
    .slice(0, 10);

  // Najproduktivniji scenaristi: top 10 scenarista po broju filmova
  const writerCounts = new Map<string, number>();
  for (const m of allMovies) {
    const writers: string[] = Array.isArray(m.writers) ? m.writers : [];
    for (const w of writers) {
      if (w) writerCounts.set(w, (writerCounts.get(w) || 0) + 1);
    }
  }
  const topWriters = Array.from(writerCounts.entries())
    .map(([name, count]) => ({ name, movies: count }))
    .sort((a, b) => b.movies - a.movies || a.name.localeCompare(b.name))
    .slice(0, 10);

  // Najskuplji filmovi: top 10 po budžetu
  const topBudget = [...allMovies]
    .filter(m => m.budget > 0)
    .sort((a, b) => (b.budget - a.budget))
    .slice(0, 10)
    .map(m => ({
      title: m.original_title || m.title,
      year: m.release_date ? m.release_date.slice(0, 4) : '',
      amount: m.budget
    }));

  // Najunosniji filmovi: top 10 po prihodu
  const topRevenue = [...allMovies]
    .filter(m => m.revenue > 0)
    .sort((a, b) => (b.revenue - a.revenue))
    .slice(0, 10)
    .map(m => ({
      title: m.original_title || m.title,
      year: m.release_date ? m.release_date.slice(0, 4) : '',
      amount: m.revenue
    }));

  // Najduži filmovi: top 10 po trajanju
  const topLongest = [...allMovies]
    .filter(m => m.runtime > 0)
    .sort((a, b) => (b.runtime - a.runtime))
    .slice(0, 10)
    .map(m => ({
      title: m.original_title || m.title,
      year: m.release_date ? m.release_date.slice(0, 4) : '',
      runtime: m.runtime
    }));

  // Najkraći filmovi: top 10 po trajanju (ali samo preko 40 min)
  const topShortest = [...allMovies]
    .filter(m => m.runtime > 40)
    .sort((a, b) => (a.runtime - b.runtime))
    .slice(0, 10)
    .map(m => ({
      title: m.original_title || m.title,
      year: m.release_date ? m.release_date.slice(0, 4) : '',
      runtime: m.runtime
    }));

  // Najaktivnije godine: top 10 godina sa najviše filmova
  const yearCounts = new Map<string, number>();
  for (const m of allMovies) {
    const y = m.release_date ? m.release_date.slice(0,4) : '';
    if (!y) continue;
    yearCounts.set(y, (yearCounts.get(y) || 0) + 1);
  }
  const topYears = Array.from(yearCounts.entries())
    .sort((a,b)=> b[1]-a[1] || a[0].localeCompare(b[0]))
    .slice(0,10)
    .map(([year, count])=>({year, count}));

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                Jugofilm.online
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">
              Filmska baza sadašnjeg prostora bivše Jugoslavije — istražite filmove, glumce i saradnje
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link 
                href="/browse" 
                className="inline-flex items-center px-8 py-3 rounded-full bg-yellow-500 text-black font-semibold shadow-lg hover:shadow-xl hover:bg-yellow-400 transition-all"
              >
                Ko to tamo glumi?
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Top Banner Ad */}
        <div className="my-8">
          <div className="text-center">
            <p className="text-xs text-neutral-500 mb-2">Oglas</p>
            <AdUnit adSlot="" adFormat="horizontal" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16">
          <StatCard label="Filmova" value={movies.length} href="/browse" />
          <StatCard label="Glumaca" value={actors.length} />
          <StatCard label="Uloga" value={rolesCount} />
        </div>

        {/* Top lists */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-500">Statistike</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Glumci i glumice sa najviše filmova</h3>
              <p className="text-sm text-neutral-400 mb-4">Top 10 glumaca po broju filmova u bazi</p>
              <ol className="space-y-2 list-decimal list-inside">
                {topActors.map((a, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="truncate pr-2 text-neutral-300 text-sm">{a.name}</span>
                    <Link
                      href={`/browse?actors=${encodeURIComponent(a.name)}`}
                      className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors whitespace-nowrap"
                      aria-label={`Prikaži filmove za ${a.name}`}
                    >
                      {filmPlural(a.movies)}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Najčešći glumački parovi</h3>
              <p className="text-sm text-neutral-400 mb-4">Parovi glumaca koji su najviše puta igrali zajedno</p>
              <div className="space-y-2">
                {topPairs.map((p, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_5rem] gap-3 items-center">
                    <div className="truncate text-center text-neutral-300 text-sm">{p.a}</div>
                    <div className="truncate text-center text-neutral-300 text-sm">{p.b}</div>
                    <Link
                      href={`/browse?actors=${encodeURIComponent(p.a)},${encodeURIComponent(p.b)}`}
                      className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors text-right whitespace-nowrap"
                      aria-label={`Prikaži zajedničke filmove: ${p.a} i ${p.b}`}
                    >
                      {filmPlural(p.movies)}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Najproduktivniji režiseri</h3>
              <p className="text-sm text-neutral-400 mb-4">Režiseri sa najviše snimljenih filmova u bazi</p>
              <ol className="space-y-2 list-decimal list-inside">
                {topDirectors.map((d, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="truncate pr-2 text-neutral-300 text-sm">{d.name}</span>
                    <span className="text-sm text-neutral-400 whitespace-nowrap">{filmPlural(d.movies)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Najaktivnije godine</h3>
              <p className="text-sm text-neutral-400 mb-4">Godine sa najviše snimljenih filmova</p>
              <YearStats topYears={topYears} />
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Najčešće saradnje režisera i glumca</h3>
              <p className="text-sm text-neutral-400 mb-4">Režiseri i glumci sa najviše zajedničkih projekata</p>
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-[1fr_1fr_5rem] gap-3 text-xs text-neutral-500 pb-1">
                  <div className="text-center">R</div>
                  <div className="text-center">G</div>
                  <div></div>
                </div>
                {/* List */}
                {topActorDirector.map((p,i)=> (
                  <div key={i} className="grid grid-cols-[1fr_1fr_5rem] gap-3 items-center">
                    <div className="truncate text-center text-neutral-300 text-sm">{p.director}</div>
                    <div className="truncate text-center text-neutral-300 text-sm">{p.actor}</div>
                    <div className="text-sm text-neutral-400 text-right whitespace-nowrap">{filmPlural(p.movies)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mid-Content Ad */}
            <div className="lg:col-span-2 my-4">
              <div className="text-center">
                <p className="text-xs text-neutral-500 mb-2">Oglas</p>
                <AdUnit adSlot="" adFormat="auto" />
              </div>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Najproduktivniji scenaristi</h3>
              <p className="text-sm text-neutral-400 mb-4">Scenaristi sa najviše realizovanih scenarija</p>
              <ol className="space-y-2 list-decimal list-inside">
                {topWriters.map((w, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="truncate pr-2 text-neutral-300 text-sm">{w.name}</span>
                    <span className="text-sm text-neutral-400 whitespace-nowrap">{filmPlural(w.movies)}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Najskuplji filmovi*</h3>
              <p className="text-sm text-neutral-400 mb-4">Filmovi sa najvećim budžetom produkcije</p>
              <ol className="space-y-2 list-decimal list-inside mb-3">
                {topBudget.map((m, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="truncate pr-2 text-neutral-300 text-sm">{m.title} {m.year && `(${m.year})`}</span>
                    <span className="text-sm text-neutral-400 whitespace-nowrap">${(m.amount / 1000000).toFixed(1)}M</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-700">*Prema TMDB</p>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Najunosniji filmovi*</h3>
              <p className="text-sm text-neutral-400 mb-4">Filmovi sa najvećom zaradom</p>
              <ol className="space-y-2 list-decimal list-inside mb-3">
                {topRevenue.map((m, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="truncate pr-2 text-neutral-300 text-sm">{m.title} {m.year && `(${m.year})`}</span>
                    <span className="text-sm text-neutral-400 whitespace-nowrap">${(m.amount / 1000000).toFixed(1)}M</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-700">*Prema TMDB</p>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Najduži filmovi</h3>
              <p className="text-sm text-neutral-400 mb-4">Filmovi sa najdužim trajanjem</p>
              <ol className="space-y-2 list-decimal list-inside">
                {topLongest.map((m, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="truncate pr-2 text-neutral-300 text-sm">{m.title} {m.year && `(${m.year})`}</span>
                    <span className="text-sm text-neutral-400 whitespace-nowrap">{m.runtime} min</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Najkraći filmovi</h3>
              <p className="text-sm text-neutral-400 mb-4">Dugometražni filmovi (preko 40 min) sa najkraćim trajanjem</p>
              <ol className="space-y-2 list-decimal list-inside">
                {topShortest.map((m, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="truncate pr-2 text-neutral-300 text-sm">{m.title} {m.year && `(${m.year})`}</span>
                    <span className="text-sm text-neutral-400 whitespace-nowrap">{m.runtime} min</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-950 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4">
              <p className="text-sm text-neutral-500">
                This website uses the TMDb API but is not endorsed or certified by TMDb.
              </p>
              <img 
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDb Logo"
                className="h-4"
              />
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-neutral-400 hover:text-yellow-500 transition-colors">
                Politika privatnosti
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const content = (
    <div className={`bg-neutral-800 border border-neutral-700 rounded-2xl shadow-lg p-6 ${href ? 'hover:shadow-xl hover:scale-105 hover:border-yellow-500/50 transition-all cursor-pointer' : 'transition-shadow'}`}>
      <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">{label}</div>
      <div className="mt-2 text-4xl font-bold text-yellow-500">
        {value.toLocaleString('sr-RS')}
      </div>
    </div>
  );
  return href ? <Link href={href} aria-label={`${label} – idi na pretragu`}>{content}</Link> : content;
}
