import React from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import MainContent from './components/MainContent';
import PlayerBar from './components/Player/PlayerBar';
import { MiniPlayer, FullscreenPlayer } from './components/Mobile/MobilePlayer';
import BottomNav from './components/Mobile/BottomNav';
import './styles/main.css';

function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <MainContent />
      </div>
      {/* Desktop Player */}
      <PlayerBar />
      {/* Mobile Player */}
      <MiniPlayer />
      <FullscreenPlayer />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
