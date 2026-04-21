import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SONGS } from '../../data/songs';
import Icon from '../Icon';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TrendingSection({ songs = SONGS.slice(0, 8) }) {
  const { playSong, togglePlay, currentSong, isPlaying, liked, toggleLike } = useApp();
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="trending-section">
      <button className="trending-arrow trending-arrow--left" onClick={() => scroll(-1)} title="Scroll left">
        <Icon name="chevron_down" size={18} style={{ transform: 'rotate(90deg)' }} />
      </button>
      <div className="trending-scroll" ref={scrollRef}>
        {songs.map(song => {
          const isActive = currentSong.id === song.id;
          return (
            <div
              key={song.id}
              className={`trending-card ${isActive ? 'trending-card--active' : ''}`}
              onClick={() => isActive ? togglePlay() : playSong(song, songs)}
              style={{ cursor: 'pointer' }}
            >
              <div className="trending-img-wrap">
                <img src={song.cover} alt={song.title} loading="lazy" className="trending-img" />
                <div className="trending-img-overlay">
                  <button
                    className="trending-play-btn"
                    onClick={e => { e.stopPropagation(); isActive ? togglePlay() : playSong(song, songs); }}
                    title={isPlaying && isActive ? 'Pause' : 'Play'}
                  >
                    <Icon name={isPlaying && isActive ? 'pause' : 'play'} size={20} />
                  </button>
                </div>
              </div>
              <div className="trending-info">
                <p className="trending-title">{song.title}</p>
                <p className="trending-artist">{song.artist}</p>
                <div className="trending-bottom">
                  <span className="trending-dur">{formatTime(song.duration)}</span>
                  <button
                    className={`like-btn-sm ${liked.includes(song.id) ? 'like-btn-sm--liked' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleLike(song.id); }}
                    title={liked.includes(song.id) ? 'Unlike' : 'Like'}
                  >
                    <Icon name="heart" size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="trending-arrow trending-arrow--right" onClick={() => scroll(1)} title="Scroll right">
        <Icon name="chevron_down" size={18} style={{ transform: 'rotate(-90deg)' }} />
      </button>
    </div>
  );
}
