import React from 'react';
import { useApp } from '../../context/AppContext';
import Icon from '../Icon';

export default function BottomNav() {
  const { activeNav, setActiveNav } = useApp();

  const items = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'browse', icon: 'search', label: 'Browse' },
    { id: 'library', icon: 'library', label: 'Library' },
    { id: 'liked', icon: 'heart', label: 'Liked' },
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile Navigation">
      {items.map(item => (
        <button
          key={item.id}
          className={`bottom-nav-item ${activeNav === item.id ? 'bottom-nav-item--active' : ''}`}
          onClick={() => setActiveNav(item.id)}
        >
          <Icon name={item.icon} size={21} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
