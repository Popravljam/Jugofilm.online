import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

function resolveDbPath(): string {
  // Priority: explicit env, then common runtime roots
  const candidates = [
    process.env.DATABASE_FILE,
    path.join(process.cwd(), 'data', 'jugofilm.db'),
    // When bundled, __dirname may be .next/server/app/...; go up to project root
    path.join(__dirname, '..', 'data', 'jugofilm.db'),
    path.join(__dirname, '../../', 'data', 'jugofilm.db'),
    '/home/lazar/jugofilm.online/data/jugofilm.db', // server fallback
  ].filter(Boolean) as string[];
  for (const p of candidates) {
    try { if (fs.existsSync(p)) return p; } catch {}
  }
  // Last resort: default to cwd
  return path.join(process.cwd(), 'data', 'jugofilm.db');
}

const DB_PATH = resolveDbPath();
export const __DB_PATH = DB_PATH;

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
  }
  return db;
}

export function initializeDatabase() {
  const db = getDb();

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY,
      tmdb_id INTEGER UNIQUE,
      wikidata_id TEXT,
      title TEXT NOT NULL,
      original_title TEXT,
      title_local TEXT,
      title_en TEXT,
      overview TEXT,
      release_date TEXT,
      poster_path TEXT,
      backdrop_path TEXT,
      vote_average REAL,
      vote_count INTEGER,
      popularity REAL,
      original_language TEXT,
      budget INTEGER DEFAULT 0,
      revenue INTEGER DEFAULT 0,
      runtime INTEGER DEFAULT 0,
      imdb_id TEXT,
      youtube_key TEXT,
      source TEXT DEFAULT 'tmdb'
    );

    CREATE TABLE IF NOT EXISTS actors (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      original_name TEXT,
      profile_path TEXT,
      known_for_department TEXT,
      popularity REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS directors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS writers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS movie_cast (
      movie_id INTEGER,
      actor_id INTEGER,
      character TEXT,
      cast_order INTEGER,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
      FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE,
      PRIMARY KEY (movie_id, actor_id)
    );

    CREATE TABLE IF NOT EXISTS movie_directors (
      movie_id INTEGER,
      director_id INTEGER,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
      FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE CASCADE,
      PRIMARY KEY (movie_id, director_id)
    );

    CREATE TABLE IF NOT EXISTS movie_writers (
      movie_id INTEGER,
      writer_id INTEGER,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
      FOREIGN KEY (writer_id) REFERENCES writers(id) ON DELETE CASCADE,
      PRIMARY KEY (movie_id, writer_id)
    );

    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS movie_genres (
      movie_id INTEGER,
      genre_id INTEGER,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
      FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE,
      PRIMARY KEY (movie_id, genre_id)
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies(release_date);
    CREATE INDEX IF NOT EXISTS idx_movies_popularity ON movies(popularity DESC);
    CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_actors_name ON actors(name COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_directors_name ON directors(name COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_movie_cast_actor ON movie_cast(actor_id);
    CREATE INDEX IF NOT EXISTS idx_movie_cast_movie ON movie_cast(movie_id);
    CREATE INDEX IF NOT EXISTS idx_movie_directors_director ON movie_directors(director_id);
    CREATE INDEX IF NOT EXISTS idx_movie_writers_writer ON movie_writers(writer_id);
    CREATE INDEX IF NOT EXISTS idx_genres_name ON genres(name COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_movie_genres_genre ON movie_genres(genre_id);
    CREATE INDEX IF NOT EXISTS idx_movie_genres_movie ON movie_genres(movie_id);
  `);

  console.log('Database initialized successfully');
}

export function resetDatabase() {
  const db = getDb();
  
  // Drop all tables
  db.exec(`
    DROP TABLE IF EXISTS movie_writers;
    DROP TABLE IF EXISTS movie_directors;
    DROP TABLE IF EXISTS movie_cast;
    DROP TABLE IF EXISTS writers;
    DROP TABLE IF EXISTS directors;
    DROP TABLE IF EXISTS actors;
    DROP TABLE IF EXISTS movies;
  `);
  
  console.log('Database reset complete');
  
  // Recreate tables
  initializeDatabase();
}

export function optimizeDatabase() {
  const db = getDb();
  db.exec('VACUUM');
  db.exec('ANALYZE');
  console.log('Database optimized');
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
