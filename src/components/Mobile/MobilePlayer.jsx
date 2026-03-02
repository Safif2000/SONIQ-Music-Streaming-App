import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Icon from '../Icon';

function formatTime(sec) {
  if (!sec || isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Mini Player (shown above bottom nav) ──────────────────────────────────────
export function MiniPlayer() {
  const { currentSong, isPlaying, togglePlay, skipNext, setMobilePlayerOpen, currentTime, duration } = useApp();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mini-player" onClick={() => setMobilePlayerOpen(true)}>
      {/* thin progress strip at top */}
      <div className="mini-progress-strip">
        <div className="mini-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="mini-player-inner">
        <div className={`mini-album ${isPlaying ? 'mini-album--spin' : ''}`}>
          <img src={currentSong.cover} alt={currentSong.title} />
        </div>

        <div className="mini-info">
          <p className="mini-title">{currentSong.title}</p>
          <p className="mini-artist">{currentSong.artist}</p>
        </div>

        <button
          className="mini-ctrl-btn"
          onClick={e => { e.stopPropagation(); togglePlay(); }}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size={24} />
        </button>

        <button
          className="mini-ctrl-btn"
          onClick={e => { e.stopPropagation(); skipNext(); }}
          title="Next"
        >
          <Icon name="skip_next" size={24} />
        </button>
      </div>
    </div>
  );
}

// ── Full Screen Player ────────────────────────────────────────────────────────
export function FullscreenPlayer() {
  const {
    currentSong, isPlaying, togglePlay, skipNext, skipPrev,
    currentTime, duration, seekTo,
    liked, toggleLike,
    mobilePlayerOpen, setMobilePlayerOpen,
    shuffle, setShuffle, repeat, toggleRepeat,
  } = useApp();

  const barRef  = useRef(null);
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleSeek = (e) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    // support both mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seekTo(pct * (duration || 0));
  };

  if (!mobilePlayerOpen) return null;

  return (
    <div className="fullscreen-player">
      {/* Blurred album art background */}
      <div className="fp-bg" style={{ backgroundImage: `url(${currentSong.cover})` }} />
      <div className="fp-bg-overlay" />

      {/* Header */}
      <div className="fp-header">
        <button className="fp-icon-btn" onClick={() => setMobilePlayerOpen(false)}>
          <Icon name="chevron_down" size={28} />
        </button>
        <div className="fp-header-titles">
          <p className="fp-now-label">NOW PLAYING</p>
          <p className="fp-from-label">{currentSong.album}</p>
        </div>
        <button className="fp-icon-btn">
          <Icon name="more" size={22} />
        </button>
      </div>

      {/* Vinyl Disc */}
      <div className="fp-disc-wrap">
        <div className={`fp-vinyl ${isPlaying ? 'fp-vinyl--spin' : ''}`}>
          <img src={currentSong.cover} alt={currentSong.title} className="fp-vinyl-img" />
          <div className="fp-vinyl-hole" />
          {/* groove rings */}
          <div className="fp-grooves" />
        </div>
        <div className={`fp-vinyl-glow ${isPlaying ? 'fp-vinyl-glow--active' : ''}`} />
      </div>

      {/* Song info + like */}
      <div className="fp-info-row">
        <div>
          <h2 className="fp-song-title">{currentSong.title}</h2>
          <p className="fp-song-artist">{currentSong.artist}</p>
        </div>
        <button
          className={`fp-like-btn ${liked.includes(currentSong.id) ? 'fp-like-btn--liked' : ''}`}
          onClick={() => toggleLike(currentSong.id)}
        >
          <Icon name="heart" size={24} />
        </button>
      </div>

      {/* Progress */}
      <div className="fp-progress-wrap">
        <div
          className="fp-progress-track"
          ref={barRef}
          onClick={handleSeek}
          onTouchStart={handleSeek}
          onTouchMove={handleSeek}
        >
          <div className="fp-progress-fill" style={{ width: `${progress}%` }}>
            <div className="fp-progress-dot" />
          </div>
        </div>
        <div className="fp-time-row">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="fp-controls">
        <button
          className={`fp-ctrl-btn ${shuffle ? 'fp-ctrl-btn--on' : ''}`}
          onClick={() => setShuffle(s => !s)}
        >
          <Icon name="shuffle" size={22} />
        </button>

        <button className="fp-ctrl-btn fp-skip" onClick={skipPrev}>
          <Icon name="skip_prev" size={32} />
        </button>

        <button className="fp-big-play" onClick={togglePlay}>
          <Icon name={isPlaying ? 'pause' : 'play'} size={32} />
        </button>

        <button className="fp-ctrl-btn fp-skip" onClick={skipNext}>
          <Icon name="skip_next" size={32} />
        </button>

        <button
          className={`fp-ctrl-btn ${repeat !== 'none' ? 'fp-ctrl-btn--on' : ''}`}
          onClick={toggleRepeat}
        >
          <Icon name="repeat" size={22} />
          {repeat === 'one' && <span className="fp-repeat-1">1</span>}
        </button>
      </div>
    </div>
  );
}
