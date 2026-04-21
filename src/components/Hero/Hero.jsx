import React from 'react';
import { useApp } from '../../context/AppContext';
import { SONGS } from '../../data/songs';
import Icon from '../Icon';

const featured = SONGS[2]; // Chromatic Pulse

export default function Hero() {
  const { playSong, togglePlay, isPlaying, currentSong } = useApp();
  const isThisSong = currentSong.id === featured.id;

  return (
    <section className="hero-section" style={{ '--hero-img': `url(${featured.cover})` }}>
      <div className="hero-bg-blur" />
      <div className="hero-overlay" />

      <div className="hero-body">
        <div className="hero-info">
          <span className="hero-label">
            <Icon name="trending" size={12} />
            Featured Album
          </span>
          <h1 className="hero-title">{featured.album}</h1>
          <p className="hero-artist">{featured.artist}</p>
          <p className="hero-meta">8 tracks · Electronic · 2024</p>
          <div className="hero-btns">
            <button
              className="hero-play-btn"
              onClick={() => isThisSong ? togglePlay() : playSong(featured, SONGS)}
            >
              <Icon name={isPlaying && isThisSong ? 'pause' : 'play'} size={18} />
              {isPlaying && isThisSong ? 'Pause' : 'Play Now'}
            </button>
            <button className="hero-save-btn">Add to Library</button>
          </div>
        </div>

        <div className="hero-album-art">
          <img src={featured.cover} alt={featured.album} className="hero-cover-img" />
          <div className="hero-cover-shadow" />
        </div>
      </div>
    </section>
  );
}
