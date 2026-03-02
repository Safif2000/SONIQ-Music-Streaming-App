import React from 'react';
import { useApp } from '../context/AppContext';
import { SONGS, ARTISTS } from '../data/songs';
import Hero from './Hero/Hero';
import PlaylistCard from './Sections/PlaylistCard';
import SongRow from './Sections/SongRow';
import TrendingSection from './Sections/TrendingSection';
import ArtistCard from './Sections/ArtistCard';
import Icon from './Icon';

// Reusable section wrapper
function Section({ title, action, children }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <h2 className="section-title">{title}</h2>
        {action && <button className="section-see-all" onClick={action.fn}>{action.label}</button>}
      </div>
      {children}
    </section>
  );
}

// Home page
function HomePage() {
  const { allPlaylists, setActiveNav } = useApp();

  return (
    <>
      <Hero />

      <Section title="Your Playlists" action={{ label: 'See All', fn: () => setActiveNav('playlists') }}>
        <div className="playlists-grid">
          {allPlaylists.slice(0, 6).map(pl => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      </Section>

      <Section title="🔥 Trending Now">
        <TrendingSection songs={SONGS.slice(0, 8)} />
      </Section>

      <Section title="Favorite Artists">
        <div className="artists-grid">
          {ARTISTS.map(a => <ArtistCard key={a.id} artist={a} />)}
        </div>
      </Section>

      <Section title="New Releases">
        <div className="song-list-header">
          <span className="slh-num">#</span>
          <span className="slh-title">Title</span>
          <span className="slh-album">Album</span>
          <span className="slh-genre">Genre</span>
          <span className="slh-dur">Duration</span>
        </div>
        <div className="song-list">
          {SONGS.slice(6).map((song, i) => (
            <SongRow key={song.id} song={song} index={i} songList={SONGS.slice(6)} />
          ))}
        </div>
      </Section>
    </>
  );
}

// Browse / Search page
function BrowsePage() {
  const { filteredSongs, search } = useApp();

  return (
    <div className="page-container">
      <h2 className="page-title">
        {search ? `Results for "${search}"` : 'Browse All'}
      </h2>
      {filteredSongs.length === 0 ? (
        <div className="empty-state">
          <Icon name="search" size={52} className="empty-icon" />
          <p>No results found for "{search}"</p>
        </div>
      ) : (
        <div className="song-list">
          {filteredSongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} songList={filteredSongs} />
          ))}
        </div>
      )}
    </div>
  );
}

// Library page
function LibraryPage() {
  return (
    <div className="page-container">
      <h2 className="page-title">Your Library</h2>
      <div className="song-list-header">
        <span className="slh-num">#</span>
        <span className="slh-title">Title</span>
        <span className="slh-album">Album</span>
        <span className="slh-genre">Genre</span>
        <span className="slh-dur">Duration</span>
      </div>
      <div className="song-list">
        {SONGS.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} songList={SONGS} />
        ))}
      </div>
    </div>
  );
}

// Playlists page
function PlaylistsPage() {
  const { allPlaylists } = useApp();
  return (
    <div className="page-container">
      <h2 className="page-title">Playlists</h2>
      <div className="playlists-grid">
        {allPlaylists.map(pl => <PlaylistCard key={pl.id} playlist={pl} />)}
      </div>
    </div>
  );
}

// Liked songs page
function LikedPage() {
  const { liked } = useApp();
  const likedSongs = SONGS.filter(s => liked.includes(s.id));

  return (
    <div className="liked-page">
      <div className="liked-page-header">
        <div className="liked-page-icon">
          <Icon name="heart" size={52} />
        </div>
        <div className="liked-page-meta">
          <span className="liked-label-tag">PLAYLIST</span>
          <h1 className="liked-page-title">Liked Songs</h1>
          <p className="liked-page-count">{likedSongs.length} songs</p>
        </div>
      </div>

      {likedSongs.length === 0 ? (
        <div className="empty-state">
          <Icon name="heart" size={52} className="empty-icon" />
          <p>Songs you like will appear here</p>
        </div>
      ) : (
        <div className="song-list">
          {likedSongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} songList={likedSongs} />
          ))}
        </div>
      )}
    </div>
  );
}

// Recent page
function RecentPage() {
  const recentSongs = [...SONGS].reverse().slice(0, 10);
  return (
    <div className="page-container">
      <h2 className="page-title">Recently Played</h2>
      <div className="song-list">
        {recentSongs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} songList={recentSongs} />
        ))}
      </div>
    </div>
  );
}

export default function MainContent() {
  const { activeNav, search } = useApp();

  // Search overrides nav
  if (search.trim()) return (
    <div className="main-scroll-area"><BrowsePage /></div>
  );

  const pages = {
    home: <HomePage />,
    browse: <BrowsePage />,
    library: <LibraryPage />,
    playlists: <PlaylistsPage />,
    liked: <LikedPage />,
    recent: <RecentPage />,
  };

  return (
    <main className="main-scroll-area">
      {pages[activeNav] || <HomePage />}
      <div style={{ height: '32px' }} />
    </main>
  );
}
