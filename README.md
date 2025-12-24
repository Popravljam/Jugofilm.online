# Jugofilm.online

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18046237.svg)](https://doi.org/10.5281/zenodo.18046237)

A comprehensive film database for the ex-Yugoslav region, featuring movies, actors, directors, and collaborative relationships from Serbia, Croatia, Bosnia and Herzegovina, Montenegro, North Macedonia, Slovenia, and Kosovo.

## Features

- Search and browse thousands of ex-Yugoslav films
- Filter by actors and see collaborative networks
- Detailed movie pages with cast, crew, trailers, and similar films
- Statistics on most prolific actors, directors, and collaborations
- Google Analytics integration for tracking
- Google AdSense integration for monetization
- GDPR-compliant privacy policy and cookie consent
- Responsive design with dark theme
- Server-side rendering with Next.js 16

## Technology Stack

- **Framework:** Next.js 16 with Turbopack
- **Language:** TypeScript
- **Database:** SQLite with better-sqlite3
- **Data Sources:** TMDb API, Wikidata SPARQL
- **Styling:** Tailwind CSS
- **Deployment:** Node.js with PM2 process manager

## Prerequisites

- Node.js 22 or higher
- TMDb API account (free)
- Google Analytics account (optional)
- Google AdSense account (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Popravljam/Jugofilm.online.git
cd Jugofilm.online
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` with your API keys:
   - Get TMDb API key from https://www.themoviedb.org/settings/api
   - Get Google Analytics ID from https://analytics.google.com/ (optional)
   - Get Google AdSense Publisher ID from https://www.google.com/adsense/ (optional)

5. Fetch movie data:
```bash
npm run fetch-data
```

This will populate the SQLite database with movie data from TMDb and Wikidata. The process may take 30-60 minutes.

6. Run development server:
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Database Schema

The SQLite database includes the following tables:

- `movies` - Film information (title, release date, budget, revenue, runtime, etc.)
- `actors` - Actor profiles
- `directors` - Director profiles
- `writers` - Writer profiles
- `genres` - Film genres
- `movie_cast` - Actor roles in films
- `movie_directors` - Director-film relationships
- `movie_writers` - Writer-film relationships
- `movie_genres` - Genre-film relationships

## Data Sources

### TMDb API
The primary data source for movie information, including:
- Film metadata (titles, dates, budgets, ratings)
- Cast and crew information
- Posters and backdrop images
- YouTube trailer keys

Fetches movies from countries: RS, HR, BA, ME, MK, SI, XK, YU, CS

### Wikidata
Supplementary source for additional ex-Yugoslav films not in TMDb.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run fetch-data` - Fetch and populate database
- `npm run lint` - Run ESLint

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Process Manager (PM2)

```bash
npm install -g pm2
pm2 start npm --name "jugofilm" -- start
pm2 save
pm2 startup
```

### Nginx Configuration

Example Nginx reverse proxy configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Automated Data Updates

Set up a cron job to update the database weekly:

```bash
0 2 * * 0 cd /path/to/jugofilm.online && npm run fetch-data >> /var/log/jugofilm-update.log 2>&1
```

## Google AdSense Setup

1. Apply for AdSense at https://www.google.com/adsense/
2. Add your Publisher ID to `.env.local`
3. Copy `public/ads.txt.example` to `public/ads.txt` and update with your ID
4. Create ad units in AdSense dashboard
5. Update ad slot IDs in:
   - `app/page.tsx` (homepage)
   - `app/browse/page.tsx` (browse page)
   - `components/MovieDetailClient.tsx` (movie detail page)

See `docs/GOOGLE_SETUP.md` and `docs/AD_PLACEMENT_EXAMPLES.md` for detailed instructions.

## GDPR Compliance

The site includes:
- Privacy policy page at `/privacy`
- Cookie consent banner
- User rights information
- Third-party data disclosure

Update the contact email in `app/privacy/page.tsx` with your privacy contact.

## Project Structure

```
Jugofilm.online/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── browse/            # Browse page
│   ├── movie/[id]/        # Dynamic movie detail pages
│   ├── privacy/           # Privacy policy
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
├── lib/                   # Utility functions and database
├── scripts/               # Data fetching scripts
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── docs/                  # Documentation
```

## Performance

- Server-side rendering for SEO
- SQLite for fast local queries
- Image optimization via Next.js Image component
- Static page generation where possible
- Efficient database indexes

## Contributing

Contributions are welcome. Please open an issue or pull request.

## License

MIT License

Copyright (c) 2024 Lazar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Acknowledgments

- Movie data provided by TMDb API
- Supplementary data from Wikidata
- Built with Next.js and React
- Styled with Tailwind CSS

## Contact

For questions or support, please open an issue on GitHub.

## Author

Lazar - https://github.com/Popravljam
