import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SONGS } from '../../data/songs';
import Icon from '../Icon';

function formatTime(sec) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SongRow({ song, index, songList }) {
  const { playSong, togglePlay, currentSong, isPlaying, liked, toggleLike, allPlaylists, addSongToPlaylist } = useApp();
  const isActive = currentSong.id === song.id;
  const queue = songList || SONGS;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handlePlay = () => {
    if (isActive) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setShowMenu(v => !v);
  };

  // Close menu on outside click
  React.useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  return (
    <div
      className={`song-row ${isActive ? 'song-row--active' : ''}`}
      onClick={handlePlay}
      style={{ cursor: 'pointer' }}
    >
      <div className="song-row-num">
        {isActive ? (
          <button className="song-row-playing-icon" onClick={e => { e.stopPropagation(); togglePlay(); }}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={14} />
          </button>
        ) : (
          <span className="song-row-index">{index + 1}</span>
        )}
      </div>

      <img
        src={song.cover}
        alt={song.title}
        className="song-row-thumb"
        loading="lazy"
        style={{ cursor: 'pointer' }}
      />

      <div className="song-row-info">
        <p className={`song-row-title ${isActive ? 'song-row-title--active' : ''}`}>
          {song.title}
        </p>
        <p className="song-row-artist">{song.artist}</p>
      </div>

      <p className="song-row-album">{song.album}</p>
      <p className="song-row-genre">{song.genre}</p>

      <div className="song-row-actions" onClick={e => e.stopPropagation()}>
        <button
          className={`like-btn ${liked.includes(song.id) ? 'like-btn--liked' : ''}`}
          onClick={() => toggleLike(song.id)}
          title={liked.includes(song.id) ? 'Unlike' : 'Like'}
        >
          <Icon name="heart" size={15} />
        </button>
        <span className="song-row-duration">{formatTime(song.duration)}</span>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button className="icon-btn-sm" title="More options" onClick={handleMoreClick}>
            <Icon name="more" size={15} />
          </button>
          {showMenu && (
            <div className="song-context-menu">
              <p className="song-context-title">{song.title}</p>
              <div className="song-context-divider" />
              <button className="song-context-item" onClick={() => { toggleLike(song.id); setShowMenu(false); }}>
                <Icon name="heart" size={13} />
                {liked.includes(song.id) ? 'Remove from Liked' : 'Add to Liked Songs'}
              </button>
              <div className="song-context-divider" />
              <p className="song-context-label">Add to Playlist</p>
              {allPlaylists.map(pl => (
                <button key={pl.id} className="song-context-item" onClick={() => { addSongToPlaylist(pl.id, song.id); setShowMenu(false); }}>
                  <Icon name="list" size={13} />
                  {pl.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
