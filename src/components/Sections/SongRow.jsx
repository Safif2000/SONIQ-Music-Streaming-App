import React from 'react';
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
  const { playSong, togglePlay, currentSong, isPlaying, liked, toggleLike } = useApp();
  const isActive = currentSong.id === song.id;
  const queue = songList || SONGS;

  return (
    <div
      className={`song-row ${isActive ? 'song-row--active' : ''}`}
      onDoubleClick={() => playSong(song, queue)}
    >
      <div className="song-row-num">
        {isActive ? (
          <button className="song-row-playing-icon" onClick={togglePlay}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={14} />
          </button>
        ) : (
          <span className="song-row-index">{index + 1}</span>
        )}
      </div>

      <img src={song.cover} alt={song.title} className="song-row-thumb" loading="lazy" />

      <div className="song-row-info">
        <p className={`song-row-title ${isActive ? 'song-row-title--active' : ''}`}>
          {song.title}
        </p>
        <p className="song-row-artist">{song.artist}</p>
      </div>

      <p className="song-row-album">{song.album}</p>
      <p className="song-row-genre">{song.genre}</p>

      <div className="song-row-actions">
        <button
          className={`like-btn ${liked.includes(song.id) ? 'like-btn--liked' : ''}`}
          onClick={() => toggleLike(song.id)}
          title={liked.includes(song.id) ? 'Unlike' : 'Like'}
        >
          <Icon name="heart" size={15} />
        </button>
        <span className="song-row-duration">{formatTime(song.duration)}</span>
        <button className="icon-btn-sm" title="More options">
          <Icon name="more" size={15} />
        </button>
      </div>
    </div>
  );
}
