import React, { useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Icon from '../Icon';

function formatTime(sec) {
  if (!sec || isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar() {
  const { currentTime, duration, seekTo } = useApp();
  const barRef  = useRef(null);
  const isDragging = useRef(false);
  const progress  = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const getPercent = (e) => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    seekTo(getPercent(e) * (duration || 0));
    const onMove = (ev) => { if (isDragging.current) seekTo(getPercent(ev) * (duration || 0)); };
    const onUp   = (ev) => { seekTo(getPercent(ev) * (duration || 0)); isDragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="progress-bar-row">
      <span className="time-display">{formatTime(currentTime)}</span>
      <div className="progress-track" ref={barRef} onMouseDown={handleMouseDown}>
        <div className="progress-filled" style={{ width: `${progress}%` }}>
          <div className="progress-knob" />
        </div>
      </div>
      <span className="time-display">{formatTime(duration)}</span>
    </div>
  );
}

// ── Waveform ──────────────────────────────────────────────────────────────────
const WAVE_HEIGHTS = Array.from({ length: 18 }, (_, i) => 4 + Math.sin(i * 0.8) * 7 + (i % 3) * 2);

function Waveform({ active }) {
  return (
    <div className="waveform" aria-hidden="true">
      {WAVE_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className={`wave-bar ${active ? 'wave-bar--active' : ''}`}
          style={{ height: `${h}px`, animationDelay: `${i * 0.06}s` }}
        />
      ))}
    </div>
  );
}

// ── Main Player Bar ───────────────────────────────────────────────────────────
export default function PlayerBar() {
  const {
    currentSong, isPlaying, togglePlay, skipNext, skipPrev,
    volume, setVolume, isMuted, toggleMute,
    shuffle, setShuffle, repeat, toggleRepeat,
    liked, toggleLike, isLoading,
  } = useApp();

  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));
  const volPercent = isMuted ? 0 : volume * 100;

  return (
    <footer className="player-bar" role="complementary" aria-label="Music Player">

      {/* ── Left: Song Info ── */}
      <div className="player-left">
        <div className="player-thumb-wrap">
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className={`player-thumb ${isPlaying ? 'player-thumb--spin' : ''}`}
          />
          {isLoading && <div className="player-loading-ring" />}
        </div>
        <div className="player-song-meta">
          <p className="player-song-title" title={currentSong.title}>{currentSong.title}</p>
          <p className="player-song-artist">{currentSong.artist}</p>
        </div>
        <button
          className={`like-btn ${liked.includes(currentSong.id) ? 'like-btn--liked' : ''}`}
          onClick={() => toggleLike(currentSong.id)}
          title={liked.includes(currentSong.id) ? 'Unlike' : 'Like'}
        >
          <Icon name="heart" size={17} />
        </button>
      </div>

      {/* ── Center: Controls + Progress ── */}
      <div className="player-center">
        <div className="player-controls-row">
          <button
            className={`ctrl-btn ${shuffle ? 'ctrl-btn--active' : ''}`}
            onClick={() => setShuffle(s => !s)}
            title="Shuffle"
          >
            <Icon name="shuffle" size={17} />
          </button>

          <button className="ctrl-btn" onClick={skipPrev} title="Previous">
            <Icon name="skip_prev" size={20} />
          </button>

          <button
            className="play-pause-btn"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading
              ? <div className="play-btn-spinner" />
              : <Icon name={isPlaying ? 'pause' : 'play'} size={22} />
            }
          </button>

          <button className="ctrl-btn" onClick={skipNext} title="Next">
            <Icon name="skip_next" size={20} />
          </button>

          <button
            className={`ctrl-btn repeat-btn ${repeat !== 'none' ? 'ctrl-btn--active' : ''}`}
            onClick={toggleRepeat}
            title={`Repeat: ${repeat}`}
          >
            <Icon name="repeat" size={17} />
            {repeat === 'one' && <span className="repeat-one-badge">1</span>}
          </button>
        </div>

        <ProgressBar />
      </div>

      {/* ── Right: Volume ── */}
      <div className="player-right">
        <Waveform active={isPlaying} />

        <button className="ctrl-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
          <Icon
            name={isMuted || volume === 0 ? 'volume_x' : volume < 0.5 ? 'volume1' : 'volume2'}
            size={17}
          />
        </button>

        <div className="volume-bar-wrap">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-range"
            aria-label="Volume"
            style={{ '--vol-pct': `${volPercent}%` }}
          />
        </div>
      </div>
    </footer>
  );
}
