import React from 'react';
import { useApp } from '../../context/AppContext';
import { SONGS } from '../../data/songs';

export default function ArtistCard({ artist }) {
  const { playSong } = useApp();
  const artistSongs = SONGS.filter(s => s.artist === artist.name);

  return (
    <div
      className="artist-card"
      onClick={() => artistSongs.length && playSong(artistSongs[0], artistSongs)}
      role="button"
      tabIndex={0}
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
