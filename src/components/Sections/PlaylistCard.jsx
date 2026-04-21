import React from 'react';
import { useApp } from '../../context/AppContext';

export default function PlaylistCard({ playlist }) {
  const { setActiveNav, setActivePlaylistId } = useApp();

  const handleCardClick = () => {
    setActivePlaylistId(playlist.id);
    setActiveNav('playlists');
  };

  return (
    <div className="playlist-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="playlist-card-img-wrap">
        <img src={playlist.cover} alt={playlist.name} className="playlist-card-img" loading="lazy" />
      </div>
      <div className="playlist-card-info">
        <p className="playlist-card-name">{playlist.name}</p>
        <p className="playlist-card-desc">{playlist.desc}</p>
      </div>
    </div>
  );
}
