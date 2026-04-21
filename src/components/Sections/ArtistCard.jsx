import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ArtistCard({ artist }) {
  const { setActiveNav, setActiveArtist } = useApp();

  const handleClick = () => {
    setActiveArtist(artist);
    setActiveNav('artist');
  };

  return (
    <div
      className="artist-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div className="artist-img-wrap">
        <img src={artist.cover} alt={artist.name} loading="lazy" className="artist-img" />
        <div className="artist-img-ring" />
      </div>
      <p className="artist-name">{artist.name}</p>
      <p className="artist-followers">{artist.followers} followers</p>
    </div>
  );
}
