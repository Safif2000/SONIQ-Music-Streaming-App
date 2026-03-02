import React from 'react';
import { useApp } from '../../context/AppContext';
import { SONGS } from '../../data/songs';
import Icon from '../Icon';

export default function PlaylistCard({ playlist }) {
  const { playSong } = useApp();
  const songs = SONGS.filter(s => playlist.songIds.includes(s.id));

  const handlePlay = (e) => {
    e.stopPropagation();
    if (songs.length > 0) playSong(songs[0], songs);
  };

  return (
    <div className="playlist-card">
      <div className="playlist-card-img-wrap">
        <img src={playlist.cover} alt={playlist.name} className="playlist-card-img" loading="lazy" />
        <div className="playlist-card-hover-overlay">
          <button className="playlist-hover-play-btn" onClick={handlePlay}>
            <Icon name="play" size={20} />
          </button>
        </div>
      </div>
      <div className="playlist-card-info">
        <p className="playlist-card-name">{playlist.name}</p>
        <p className="playlist-card-desc">{playlist.desc}</p>
      </div>
    </div>
  );
}
