import React from 'react';
import { useApp } from '../context/AppContext';
import { SONGS, ARTISTS } from '../data/songs';
import Hero from './Hero/Hero';
import PlaylistCard from './Sections/PlaylistCard';
import SongRow from './Sections/SongRow';
import TrendingSection from './Sections/TrendingSection';
import ArtistCard from './Sections/ArtistCard';
import Icon from './Icon';

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

function SongListHeader() {
  return (
    <div className="song-list-header">
      <span className="slh-num">#</span>
      <span className="slh-title">Title</span>
      <span className="slh-album">Album</span>
      <span className="slh-genre">Genre</span>
      <span className="slh-dur">Duration</span>
    </div>
  );
}

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
        <SongListHeader />
        <div className="song-list">
          {SONGS.slice(11).map((song, i) => (
            <SongRow key={song.id} song={song} index={i} songList={SONGS.slice(11)} />
          ))}
        </div>
      </Section>
    </>
  );
}

function BrowsePage() {
  const { filteredSongs, search, setSearch } = useApp();
  const [activeGenre, setActiveGenre] = React.useState('All');

  const genres = ['All', ...Array.from(new Set(SONGS.map(s => s.genre))).sort()];

  const displaySongs = React.useMemo(() => {
    let songs = filteredSongs;
    if (activeGenre !== 'All') {
      songs = songs.filter(s => s.genre === activeGenre);
    }
    return songs;
  }, [filteredSongs, activeGenre]);

  return (
    <div className="browse-page">
      <div className="browse-hero">
        <h2 className="browse-hero-title">
          {search ? `Results for "${search}"` : 'Browse All'}
        </h2>
        <p className="browse-hero-sub">
          {search ? `${displaySongs.length} songs found` : 'Discover music by genre'}
        </p>
        {!search && (
          <div className="browse-filter-row">
            {genres.map(g => (
              <button
                key={g}
                className={`browse-filter-chip ${activeGenre === g ? 'browse-filter-chip--active' : ''}`}
                onClick={() => setActiveGenre(g)}
              >{g}</button>
            ))}
          </div>
        )}
      </div>

      <div className="browse-results">
        <p className="browse-results-count">
          {displaySongs.length} TRACKS {activeGenre !== 'All' && !search ? `· ${activeGenre.toUpperCase()}` : ''}
        </p>
        {displaySongs.length === 0 ? (
          <div className="empty-state">
            <Icon name="search" size={52} className="empty-icon" />
            <p>No results found{search ? ` for "${search}"` : ''}</p>
          </div>
        ) : (
          <>
            <SongListHeader />
            <div className="song-list">
              {displaySongs.map((song, i) => (
                <SongRow key={song.id} song={song} index={i} songList={displaySongs} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LibraryPage() {
  const [sortBy, setSortBy] = React.useState('default');

  const sortedSongs = React.useMemo(() => {
    const s = [...SONGS];
    if (sortBy === 'title') return s.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'artist') return s.sort((a, b) => a.artist.localeCompare(b.artist));
    if (sortBy === 'genre') return s.sort((a, b) => a.genre.localeCompare(b.genre));
    return s;
  }, [sortBy]);

  const totalMins = Math.round(SONGS.reduce((acc, s) => acc + s.duration, 0) / 60);
  const uniqueArtists = new Set(SONGS.map(s => s.artist)).size;

  return (
    <div className="library-page">
      <div className="library-banner">
        <div className="library-banner-icon">♫</div>
        <div className="library-banner-info">
          <p className="library-banner-label">Your Collection</p>
          <h2 className="library-banner-title">Your Library</h2>
          <div className="library-banner-stats">
            <span className="library-banner-stat"><strong>{SONGS.length}</strong> songs</span>
            <span className="library-banner-stat"><strong>{uniqueArtists}</strong> artists</span>
            <span className="library-banner-stat"><strong>{totalMins}</strong> min</span>
          </div>
        </div>
      </div>

      <div className="library-sort-row">
        <span className="library-sort-label">Sort by</span>
        <div className="library-sort-btns">
          {[['default','Default'],['title','Title'],['artist','Artist'],['genre','Genre']].map(([val, label]) => (
            <button
              key={val}
              className={`library-sort-btn ${sortBy === val ? 'library-sort-btn--active' : ''}`}
              onClick={() => setSortBy(val)}
            >{label}</button>
          ))}
        </div>
      </div>

      <div className="library-songs-area">
        <SongListHeader />
        <div className="song-list">
          {sortedSongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} songList={sortedSongs} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaylistsPage() {
  const { allPlaylists, userPlaylists, playSong, setActiveNav, deletePlaylist, renamePlaylist, addSongToPlaylist, removeSongFromPlaylist, createPlaylist, activePlaylistId, setActivePlaylistId } = useApp();
  const [selectedPl, setSelectedPl] = React.useState(activePlaylistId || null);
  const [showAddSongs, setShowAddSongs] = React.useState(false);
  const [searchSongs, setSearchSongs] = React.useState('');
  const [creatingPl, setCreatingPl] = React.useState(false);
  const [newPlName, setNewPlName] = React.useState('');
  const [editingName, setEditingName] = React.useState(false);
  const [editName, setEditName] = React.useState('');

  // If a playlist is selected, show detail
  if (selectedPl) {
    const pl = allPlaylists.find(p => p.id === selectedPl);
    if (!pl) { setSelectedPl(null); return null; }
    const plSongs = SONGS.filter(s => pl.songIds.includes(s.id));
    const filteredAdd = SONGS.filter(s =>
      !pl.songIds.includes(s.id) &&
      (s.title.toLowerCase().includes(searchSongs.toLowerCase()) ||
       s.artist.toLowerCase().includes(searchSongs.toLowerCase()))
    );

    return (
      <div className="page-container">
        <button className="back-btn" onClick={() => { setSelectedPl(null); setActivePlaylistId(null); setShowAddSongs(false); setSearchSongs(''); }}>
          <Icon name="chevron_down" size={16} style={{ transform: 'rotate(90deg)' }} /> Back to Playlists
        </button>

        {/* Playlist Header */}
        <div className="pl-detail-header">
          <img src={pl.cover} alt={pl.name} className="pl-detail-cover" />
          <div className="pl-detail-meta">
            <span className="liked-label-tag">PLAYLIST</span>
            {editingName && pl.isUser ? (
              <div className="pl-edit-name-row">
                <input
                  className="pl-edit-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { renamePlaylist(pl.id, editName); setEditingName(false); } if (e.key === 'Escape') setEditingName(false); }}
                  autoFocus
                />
                <button className="btn-create" onClick={() => { renamePlaylist(pl.id, editName); setEditingName(false); }}>Save</button>
                <button className="btn-cancel" onClick={() => setEditingName(false)}>Cancel</button>
              </div>
            ) : (
              <h1 className="pl-detail-title" onClick={() => { if (pl.isUser) { setEditName(pl.name); setEditingName(true); } }}>
                {pl.name} {pl.isUser && <span className="pl-edit-hint">✏️</span>}
              </h1>
            )}
            <p className="pl-detail-desc">{pl.desc}</p>
            <p className="pl-detail-count">{plSongs.length} songs</p>
            <div className="pl-detail-actions">
              {plSongs.length > 0 && (
                <button className="hero-play-btn" onClick={() => playSong(plSongs[0], plSongs)}>
                  <Icon name="play" size={16} /> Play All
                </button>
              )}
              <button className="hero-save-btn" onClick={() => setShowAddSongs(v => !v)}>
                {showAddSongs ? 'Done Adding' : '+ Add Songs'}
              </button>
              {pl.isUser && (
                <button className="pl-delete-btn" onClick={() => { deletePlaylist(pl.id); setSelectedPl(null); }}>
                  <Icon name="trash" size={15} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add Songs Panel */}
        {showAddSongs && (
          <div className="add-songs-panel">
            <div className="add-songs-header">
              <h3 className="add-songs-title">Add Songs to Playlist</h3>
              <input
                className="add-songs-search"
                placeholder="Search songs..."
                value={searchSongs}
                onChange={e => setSearchSongs(e.target.value)}
              />
            </div>
            <div className="add-songs-list">
              {filteredAdd.length === 0 ? (
                <p className="add-songs-empty">No more songs to add{searchSongs ? ` for "${searchSongs}"` : ''}</p>
              ) : filteredAdd.map(song => (
                <div key={song.id} className="add-song-row">
                  <img src={song.cover} alt={song.title} className="add-song-thumb" />
                  <div className="add-song-info">
                    <p className="add-song-title">{song.title}</p>
                    <p className="add-song-artist">{song.artist} · {song.genre}</p>
                  </div>
                  <button className="add-song-btn" onClick={() => addSongToPlaylist(pl.id, song.id)}>
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Songs in playlist */}
        {plSongs.length === 0 ? (
          <div className="empty-state">
            <Icon name="list" size={52} className="empty-icon" />
            <p>No songs yet. Click "+ Add Songs" above to get started!</p>
          </div>
        ) : (
          <>
            <SongListHeader />
            <div className="song-list">
              {plSongs.map((song, i) => (
                <div key={song.id} className="pl-song-row-wrap">
                  <SongRow song={song} index={i} songList={plSongs} />
                  {(
                    <button
                      className="pl-remove-btn"
                      title="Remove from playlist"
                      onClick={() => removeSongFromPlaylist(pl.id, song.id)}
                    >
                      <Icon name="x" size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Main playlists grid
  return (
    <div className="page-container">
      <div className="pl-page-header">
        <h2 className="page-title">Playlists</h2>
        <button className="hero-save-btn" onClick={() => setCreatingPl(true)}>
          + New Playlist
        </button>
      </div>

      {/* Create playlist inline modal */}
      {creatingPl && (
        <div className="create-pl-card">
          <p className="create-pl-title">New Playlist</p>
          <input
            className="pl-name-input"
            placeholder="Give it a name..."
            value={newPlName}
            onChange={e => setNewPlName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newPlName.trim()) { createPlaylist(newPlName.trim()); setNewPlName(''); setCreatingPl(false); }
              if (e.key === 'Escape') { setNewPlName(''); setCreatingPl(false); }
            }}
            autoFocus
          />
          <div className="pl-form-btns">
            <button className="btn-create" onClick={() => { if (newPlName.trim()) { createPlaylist(newPlName.trim()); setNewPlName(''); setCreatingPl(false); } }}>Create</button>
            <button className="btn-cancel" onClick={() => { setNewPlName(''); setCreatingPl(false); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="playlists-grid">
        {allPlaylists.map(pl => (
          <div key={pl.id} className="playlist-card" onClick={() => setSelectedPl(pl.id)} style={{ cursor: 'pointer' }}>
            <div className="playlist-card-img-wrap">
              <img src={pl.cover} alt={pl.name} className="playlist-card-img" />
            </div>
            <div className="playlist-card-info">
              <p className="playlist-card-name">{pl.name}</p>
              <p className="playlist-card-desc">{pl.songIds.length} songs · {pl.isUser ? 'Your playlist' : pl.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LikedPage() {
  const { liked, playSong } = useApp();
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
          {likedSongs.length > 0 && (
            <button className="hero-play-btn" style={{ marginTop: '12px' }} onClick={() => playSong(likedSongs[0], likedSongs)}>
              <Icon name="play" size={16} /> Play All
            </button>
          )}
        </div>
      </div>

      {likedSongs.length === 0 ? (
        <div className="empty-state">
          <Icon name="heart" size={52} className="empty-icon" />
          <p>Songs you like will appear here</p>
        </div>
      ) : (
        <>
          <SongListHeader />
          <div className="song-list">
            {likedSongs.map((song, i) => (
              <SongRow key={song.id} song={song} index={i} songList={likedSongs} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RecentPage() {
  const recentSongs = [...SONGS].reverse().slice(0, 12);
  return (
    <div className="page-container">
      <h2 className="page-title">Recently Played</h2>
      <SongListHeader />
      <div className="song-list">
        {recentSongs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} songList={recentSongs} />
        ))}
      </div>
    </div>
  );
}

function AlbumPage() {
  const { activeAlbum, setActiveAlbum, setActiveNav, setActiveArtist, playSong, activeArtist } = useApp();
  if (!activeAlbum) return null;

  const handleBack = () => {
    setActiveAlbum(null);
    // Go back to artist page if we came from one
    if (activeArtist) {
      setActiveNav('artist');
    } else {
      setActiveNav('home');
    }
  };

  return (
    <div className="page-container">
      <button className="back-btn" onClick={handleBack}>
        <Icon name="chevron_down" size={16} style={{ transform: 'rotate(90deg)' }} /> Back
      </button>

      <div className="pl-detail-header">
        <img src={activeAlbum.cover} alt={activeAlbum.name} className="pl-detail-cover" />
        <div className="pl-detail-meta">
          <span className="liked-label-tag">ALBUM</span>
          <h1 className="pl-detail-title">{activeAlbum.name}</h1>
          <p className="pl-detail-desc">{activeAlbum.artist}</p>
          <p className="pl-detail-count">{activeAlbum.songs.length} songs</p>
          <div className="pl-detail-actions">
            {activeAlbum.songs.length > 0 && (
              <button className="hero-play-btn" onClick={() => playSong(activeAlbum.songs[0], activeAlbum.songs)}>
                <Icon name="play" size={16} /> Play All
              </button>
            )}
          </div>
        </div>
      </div>

      <SongListHeader />
      <div className="song-list">
        {activeAlbum.songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} songList={activeAlbum.songs} />
        ))}
      </div>
    </div>
  );
}

function ArtistPage() {
  const { activeArtist, setActiveNav, playSong, setActiveAlbum } = useApp();
  if (!activeArtist) return null;

  const artistSongs = SONGS.filter(s => s.artist === activeArtist.name);
  // Get unique albums
  const albums = [...new Set(artistSongs.map(s => s.album))];

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => setActiveNav('home')}>
        <Icon name="chevron_down" size={16} style={{ transform: 'rotate(90deg)' }} /> Back
      </button>

      <div className="artist-page-header">
        <img src={activeArtist.cover} alt={activeArtist.name} className="artist-page-img" />
        <div className="artist-page-meta">
          <span className="liked-label-tag">ARTIST</span>
          <h1 className="artist-page-name">{activeArtist.name}</h1>
          <p className="artist-page-followers">{activeArtist.followers} followers · {activeArtist.genre}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {artistSongs.length > 0 && (
              <button className="hero-play-btn" onClick={() => playSong(artistSongs[0], artistSongs)}>
                <Icon name="play" size={16} /> Play All
              </button>
            )}
            <button className="hero-save-btn">Follow</button>
          </div>
        </div>
      </div>

      <Section title={`Songs by ${activeArtist.name}`}>
        <SongListHeader />
        <div className="song-list">
          {artistSongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} songList={artistSongs} />
          ))}
        </div>
      </Section>

      {albums.length > 1 && (
        <Section title="Albums">
          <div className="playlists-grid">
            {albums.map(album => {
              const albumSongs = artistSongs.filter(s => s.album === album);
              const cover = albumSongs[0]?.cover;
              return (
                <div key={album} className="playlist-card" style={{ cursor: 'pointer' }} onClick={() => {
                setActiveAlbum({ name: album, songs: albumSongs, cover, artist: activeArtist.name });
                setActiveNav('album');
              }}>
                  <div className="playlist-card-img-wrap">
                    <img src={cover} alt={album} className="playlist-card-img" />
                  </div>
                  <div className="playlist-card-info">
                    <p className="playlist-card-name">{album}</p>
                    <p className="playlist-card-desc">{albumSongs.length} songs</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

export default function MainContent() {
  const { activeNav, search } = useApp();

  if (search.trim()) return (
    <main className="main-scroll-area"><BrowsePage /></main>
  );

  const pages = {
    home: <HomePage />,
    browse: <BrowsePage />,
    library: <LibraryPage />,
    playlists: <PlaylistsPage />,
    liked: <LikedPage />,
    recent: <RecentPage />,
    artist: <ArtistPage />,
    album: <AlbumPage />,
  };

  return (
    <main className="main-scroll-area">
      {pages[activeNav] || <HomePage />}
      <div style={{ height: '32px' }} />
    </main>
  );
}
