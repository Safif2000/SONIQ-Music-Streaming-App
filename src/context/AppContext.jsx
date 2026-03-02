import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { SONGS, PLAYLISTS } from '../data/songs';

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {

  const [currentSong,       setCurrentSong]       = useState(SONGS[0]);
  const [queue,             setQueue]             = useState(SONGS);
  const [isPlaying,         setIsPlaying]         = useState(false);
  const [currentTime,       setCurrentTime]       = useState(0);
  const [duration,          setDuration]          = useState(SONGS[0].duration);
  const [volume,            setVolume]            = useState(0.8);
  const [isMuted,           setIsMuted]           = useState(false);
  const [shuffle,           setShuffle]           = useState(false);
  const [repeat,            setRepeat]            = useState('none');
  const [liked,             setLiked]             = useState(() => JSON.parse(localStorage.getItem('soniq_liked') || '[]'));
  const [theme,             setTheme]             = useState(() => localStorage.getItem('soniq_theme') || 'dark');
  const [search,            setSearch]            = useState('');
  const [activeNav,         setActiveNav]         = useState('home');
  const [sidebarOpen,       setSidebarOpen]       = useState(true);
  const [mobilePlayerOpen,  setMobilePlayerOpen]  = useState(false);
  const [isLoading,         setIsLoading]         = useState(false);
  const [userPlaylists,     setUserPlaylists]     = useState(() => JSON.parse(localStorage.getItem('soniq_playlists') || '[]'));

  // single audio element, never recreated
  const audioEl    = useRef(null);
  const queueRef   = useRef(SONGS);
  const songRef    = useRef(SONGS[0]);
  const shuffleRef = useRef(false);
  const repeatRef  = useRef('none');

  if (!audioEl.current) {
    audioEl.current = new Audio();
    audioEl.current.preload = 'auto';
    audioEl.current.volume  = 0.8;
  }

  // keep refs in sync
  useEffect(() => { queueRef.current   = queue;       }, [queue]);
  useEffect(() => { songRef.current    = currentSong; }, [currentSong]);
  useEffect(() => { shuffleRef.current = shuffle;     }, [shuffle]);
  useEffect(() => { repeatRef.current  = repeat;      }, [repeat]);

  // helper: load src & play
  const doPlay = useCallback((src) => {
    const a = audioEl.current;
    setIsLoading(true);
    a.src = src;
    a.load();
    a.play()
      .then(() => setIsLoading(false))
      .catch(() => { setIsPlaying(false); setIsLoading(false); });
  }, []);

  // wire up events ONCE
  useEffect(() => {
    const a = audioEl.current;

    const onTime     = () => setCurrentTime(a.currentTime);
    const onDur      = () => { if (!isNaN(a.duration) && a.duration > 0) setDuration(a.duration); };
    const onWaiting  = () => setIsLoading(true);
    const onCanPlay  = () => setIsLoading(false);
    const onPlaying  = () => { setIsPlaying(true);  setIsLoading(false); };
    const onPause    = () => { setIsPlaying(false); };
    const onError    = () => { setIsPlaying(false); setIsLoading(false); };

    const onEnded = () => {
      const r   = repeatRef.current;
      const q   = queueRef.current;
      const s   = songRef.current;

      if (r === 'one') { a.currentTime = 0; a.play().catch(() => {}); return; }

      const idx = q.findIndex(x => x.id === s.id);
      let ni;
      if (shuffleRef.current) {
        do { ni = Math.floor(Math.random() * q.length); } while (q.length > 1 && ni === idx);
      } else if (r === 'all') {
        ni = (idx + 1) % q.length;
      } else {
        if (idx >= q.length - 1) { setIsPlaying(false); return; }
        ni = idx + 1;
      }
      const next = q[ni];
      songRef.current = next;
      setCurrentSong(next);
      setCurrentTime(0);
      setDuration(next.duration);
      setIsPlaying(true);
      doPlay(next.src);
    };

    a.addEventListener('timeupdate',     onTime);
    a.addEventListener('durationchange', onDur);
    a.addEventListener('waiting',        onWaiting);
    a.addEventListener('canplay',        onCanPlay);
    a.addEventListener('playing',        onPlaying);
    a.addEventListener('pause',          onPause);
    a.addEventListener('ended',          onEnded);
    a.addEventListener('error',          onError);

    return () => {
      a.removeEventListener('timeupdate',     onTime);
      a.removeEventListener('durationchange', onDur);
      a.removeEventListener('waiting',        onWaiting);
      a.removeEventListener('canplay',        onCanPlay);
      a.removeEventListener('playing',        onPlaying);
      a.removeEventListener('pause',          onPause);
      a.removeEventListener('ended',          onEnded);
      a.removeEventListener('error',          onError);
    };
  }, [doPlay]);

  // volume / mute
  useEffect(() => {
    audioEl.current.volume = isMuted ? 0 : Math.min(1, Math.max(0, volume));
  }, [volume, isMuted]);

  // theme
  useEffect(() => {
    localStorage.setItem('soniq_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem('soniq_liked',     JSON.stringify(liked));         }, [liked]);
  useEffect(() => { localStorage.setItem('soniq_playlists', JSON.stringify(userPlaylists)); }, [userPlaylists]);

  // ── PUBLIC API ────────────────────────────────────────────────────────────

  const playSong = useCallback((song, newQueue = null) => {
    if (newQueue) { queueRef.current = newQueue; setQueue(newQueue); }
    songRef.current = song;
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(song.duration);
    setIsPlaying(true);
    doPlay(song.src);
  }, [doPlay]);

  const togglePlay = useCallback(() => {
    const a = audioEl.current;
    if (!a.src) { doPlay(songRef.current.src); return; }
    if (a.paused) { a.play().catch(() => {}); }
    else          { a.pause(); }
  }, [doPlay]);

  const skipNext = useCallback(() => {
    const q   = queueRef.current;
    const s   = songRef.current;
    const idx = q.findIndex(x => x.id === s.id);
    let ni;
    if (shuffleRef.current) {
      do { ni = Math.floor(Math.random() * q.length); } while (q.length > 1 && ni === idx);
    } else {
      ni = (idx + 1) % q.length;
    }
    const next = q[ni];
    songRef.current = next;
    setCurrentSong(next);
    setCurrentTime(0);
    setDuration(next.duration);
    setIsPlaying(true);
    doPlay(next.src);
  }, [doPlay]);

  const skipPrev = useCallback(() => {
    const a = audioEl.current;
    if (a.currentTime > 3) { a.currentTime = 0; setCurrentTime(0); return; }
    const q   = queueRef.current;
    const s   = songRef.current;
    const idx = q.findIndex(x => x.id === s.id);
    const ni  = Math.max(idx - 1, 0);
    const prev = q[ni];
    songRef.current = prev;
    setCurrentSong(prev);
    setCurrentTime(0);
    setDuration(prev.duration);
    setIsPlaying(true);
    doPlay(prev.src);
  }, [doPlay]);

  const seekTo = useCallback((time) => {
    const a = audioEl.current;
    const t = Math.max(0, Math.min(time, a.duration || 0));
    a.currentTime = t;
    setCurrentTime(t);
  }, []);

  const toggleLike       = useCallback((id) => setLiked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const toggleRepeat     = useCallback(() => setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none'), []);
  const toggleTheme      = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  const toggleMute       = useCallback(() => setIsMuted(m => !m), []);

  const createPlaylist   = useCallback((name) => {
    setUserPlaylists(p => [...p, { id: Date.now(), name, desc: 'Custom playlist', songIds: [], cover: `https://picsum.photos/seed/up${Date.now()}/300/300`, isUser: true }]);
  }, []);

  const addSongToPlaylist = useCallback((plId, songId) => {
    setUserPlaylists(p => p.map(pl => pl.id === plId ? { ...pl, songIds: [...new Set([...pl.songIds, songId])] } : pl));
  }, []);

  const allPlaylists  = [...PLAYLISTS, ...userPlaylists];
  const filteredSongs = search.trim()
    ? SONGS.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase())  ||
        s.artist.toLowerCase().includes(search.toLowerCase()) ||
        s.album.toLowerCase().includes(search.toLowerCase()))
    : SONGS;

  return (
    <AppContext.Provider value={{
      currentSong, queue, isPlaying, currentTime, duration,
      volume, isMuted, shuffle, repeat, liked, theme,
      search, activeNav, sidebarOpen, mobilePlayerOpen,
      isLoading, userPlaylists, allPlaylists, filteredSongs,
      setSearch, setActiveNav, setSidebarOpen, setMobilePlayerOpen,
      setVolume, setShuffle,
      playSong, togglePlay, skipNext, skipPrev, seekTo,
      toggleLike, toggleRepeat, toggleTheme, toggleMute,
      createPlaylist, addSongToPlaylist,
    }}>
      {children}
    </AppContext.Provider>
  );
}
