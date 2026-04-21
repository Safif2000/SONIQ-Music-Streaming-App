import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icon from '../Icon';

function AccountModal({ onClose }) {
  const [name, setName] = useState('Music Lover');
  const [email, setEmail] = useState('musiclover@example.com');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Account Settings</h2>
          <button className="modal-close-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-avatar-section">
            <div className="modal-avatar-circle">
              <Icon name="user" size={40} />
            </div>
            <div>
              <p className="modal-plan-badge">Free Plan</p>
              <button className="modal-upgrade-btn">Upgrade to Pro</button>
            </div>
          </div>
          <div className="modal-field">
            <label className="modal-label">Display Name</label>
            <input className="modal-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Email</label>
            <input className="modal-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Password</label>
            <input className="modal-input" type="password" placeholder="••••••••" readOnly />
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-save" onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ onClose }) {
  const { theme, toggleTheme } = useApp();
  const [quality, setQuality] = useState('high');
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button className="modal-close-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="settings-row">
            <div>
              <p className="settings-row-label">Theme</p>
              <p className="settings-row-sub">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
            <button className="settings-toggle-btn" onClick={toggleTheme}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
          <div className="settings-divider" />
          <div className="settings-row">
            <div>
              <p className="settings-row-label">Audio Quality</p>
              <p className="settings-row-sub">Streaming bitrate</p>
            </div>
            <select className="settings-select" value={quality} onChange={e => setQuality(e.target.value)}>
              <option value="low">Normal (128kbps)</option>
              <option value="high">High (320kbps)</option>
              <option value="lossless">Lossless</option>
            </select>
          </div>
          <div className="settings-divider" />
          <div className="settings-row">
            <div>
              <p className="settings-row-label">Notifications</p>
              <p className="settings-row-sub">New releases & updates</p>
            </div>
            <button
              className={`settings-switch ${notifications ? 'settings-switch--on' : ''}`}
              onClick={() => setNotifications(v => !v)}
            >
              <span className="settings-switch-knob" />
            </button>
          </div>
          <div className="settings-divider" />
          <div className="settings-row">
            <div>
              <p className="settings-row-label">Autoplay</p>
              <p className="settings-row-sub">Continue playing similar songs</p>
            </div>
            <button
              className={`settings-switch ${autoplay ? 'settings-switch--on' : ''}`}
              onClick={() => setAutoplay(v => !v)}
            >
              <span className="settings-switch-knob" />
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-save" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { theme, toggleTheme, search, setSearch, setSidebarOpen, sidebarOpen } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [modal, setModal] = useState(null); // 'account' | 'settings' | null

  const openModal = (name) => {
    setProfileOpen(false);
    setModal(name);
  };

  return (
    <>
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
          <button className="icon-btn-nav" title="Notifications" onClick={() => alert('No new notifications')}>
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
                  <button className="dropdown-item" onClick={() => openModal('account')}>Account</button>
                  <button className="dropdown-item" onClick={() => openModal('settings')}>Settings</button>
                  <button className="dropdown-item danger" onClick={() => { setProfileOpen(false); alert('Logged out successfully!'); }}>Log Out</button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {modal === 'account'  && <AccountModal  onClose={() => setModal(null)} />}
      {modal === 'settings' && <SettingsModal onClose={() => setModal(null)} />}
    </>
  );
}
