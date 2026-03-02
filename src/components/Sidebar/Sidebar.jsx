import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLAYLISTS } from '../../data/songs';
import Icon from '../Icon';

export default function Sidebar() {
  const {
    activeNav, setActiveNav, sidebarOpen, liked,
    allPlaylists, createPlaylist,
  } = useApp();

  const [creatingPl, setCreatingPl] = useState(false);
  const [plName, setPlName] = useState('');

  const navItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'browse', icon: 'search', label: 'Browse' },
    { id: 'library', icon: 'library', label: 'Library' },
    { id: 'playlists', icon: 'list', label: 'Playlists' },
    { id: 'liked', icon: 'heart', label: 'Liked Songs', badge: liked.length },
    { id: 'recent', icon: 'clock', label: 'Recently Played' },
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (plName.trim()) {
      createPlaylist(plName.trim());
      setPlName('');
      setCreatingPl(false);
    }
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <Icon name="music2" size={18} />
        </div>
        <span className="logo-text">SONIQ</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Playlists */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span>PLAYLISTS</span>
          <button className="icon-btn-sm" onClick={() => setCreatingPl(true)}>
            <Icon name="plus" size={15} />
          </button>
        </div>

        {creatingPl && (
          <form onSubmit={handleCreate} className="new-playlist-form">
            <input
              value={plName}
              onChange={e => setPlName(e.target.value)}
              placeholder="Playlist name..."
              autoFocus
              className="pl-name-input"
            />
            <div className="pl-form-btns">
              <button type="submit" className="btn-create">Create</button>
              <button type="button" className="btn-cancel" onClick={() => setCreatingPl(false)}>Cancel</button>
            </div>
          </form>
        )}

        <div className="sidebar-playlist-list">
          {allPlaylists.map(pl => (
            <button
              key={pl.id}
              className="sidebar-pl-item"
              onClick={() => setActiveNav('playlists')}
            >
              <img src={pl.cover} alt={pl.name} className="sidebar-pl-thumb" />
              <span className="sidebar-pl-name">{pl.name}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
