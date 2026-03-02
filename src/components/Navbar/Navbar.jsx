import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icon from '../Icon';

export default function Navbar() {
  const { theme, toggleTheme, search, setSearch, setSidebarOpen, sidebarOpen } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-btn-nav" onClick={() => setSidebarOpen(o => !o)} title="Toggle Sidebar">
          <Icon name={sidebarOpen ? 'x' : 'menu'} size={20} />
        </button>

        <div className="search-container">
          <Icon name="search" size={15} className="search-prefix-icon" />
          <input
            className="search-input"
            placeholder="Search songs, artists, albums..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear-btn" onClick={() => setSearch('')}>
              <Icon name="x" size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn-nav" title="Notifications">
          <Icon name="bell" size={19} />
        </button>

        <button className="icon-btn-nav theme-btn" onClick={toggleTheme} title="Toggle Theme">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
        </button>

        <div className="profile-dropdown-wrap">
          <button className="profile-trigger" onClick={() => setProfileOpen(o => !o)}>
            <div className="nav-avatar">
              <Icon name="user" size={16} />
            </div>
            <span className="nav-username">Profile</span>
            <Icon name="chevron_down" size={13} />
          </button>

          {profileOpen && (
            <>
              <div className="overlay-dismiss" onClick={() => setProfileOpen(false)} />
              <div className="profile-dropdown">
                <div className="dropdown-user-row">
                  <div className="dropdown-avatar">
                    <Icon name="user" size={22} />
                  </div>
                  <div>
                    <p className="dropdown-name">Music Lover</p>
                    <p className="dropdown-plan">Free Plan</p>
                  </div>
                </div>
                {['Account', 'Settings', 'Log Out'].map(item => (
                  <button key={item} className={`dropdown-item ${item === 'Log Out' ? 'danger' : ''}`} onClick={() => setProfileOpen(false)}>
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
