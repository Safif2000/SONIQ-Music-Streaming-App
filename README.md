# 🎵 SONIQ – Music Streaming App

A premium, fully responsive music streaming web app inspired by Spotify (Desktop) and YouTube Music (Mobile).

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build
```

Open http://localhost:3000 in your browser.

## 📁 Project Structure

```
soniq/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                    # React entry point
    ├── App.jsx                     # Root app + layout shell
    ├── styles/
    │   └── main.css                # Complete stylesheet (dark/light, responsive)
    ├── data/
    │   └── songs.js                # Songs, artists, playlists data
    ├── context/
    │   └── AppContext.jsx          # Global state + HTML5 Audio API
    └── components/
        ├── Icon.jsx                # Inline SVG icon system
        ├── MainContent.jsx         # Page routing (Home/Browse/Library/etc)
        ├── Sidebar/
        │   └── Sidebar.jsx         # Left sidebar nav + playlist list
        ├── Navbar/
        │   └── Navbar.jsx          # Top bar: search, theme toggle, profile
        ├── Hero/
        │   └── Hero.jsx            # Featured album hero banner
        ├── Player/
        │   └── PlayerBar.jsx       # Desktop sticky bottom player
        ├── Mobile/
        │   ├── MobilePlayer.jsx    # Mini player + Fullscreen vinyl player
        │   └── BottomNav.jsx       # Mobile bottom navigation
        └── Sections/
            ├── PlaylistCard.jsx    # Playlist card with hover play
            ├── SongRow.jsx         # Song list row
            ├── TrendingSection.jsx # Horizontal scroll trending
            └── ArtistCard.jsx      # Artist circle card
```

## ✅ Features

- **Real HTML5 Audio Playback** — actual MP3 streaming
- **Play/Pause/Skip/Seek** — fully functional controls
- **Shuffle & Repeat** (none / all / one)
- **Volume control** with mute toggle
- **Like songs** — saved to localStorage
- **Dark/Light theme** — persisted in localStorage
- **Create playlists** — stored in localStorage
- **Live search** — filters across title, artist, album
- **Responsive**: Desktop (sidebar + player bar) → Mobile (bottom nav + fullscreen vinyl player)
- **Neumorphic mobile player** with rotating vinyl disc & glassmorphism background
- **Waveform animation** in desktop player

## 🎨 Design

- **Font**: Syne (display) + Inter (body)
- **Primary**: #1ed760 (Spotify green)
- **Background**: #0d0d14 (deep dark)
- **Breakpoints**: 640px (mobile), 1024px (tablet)

## 🔧 Tech Stack

- React 18
- Vite 6
- CSS Custom Properties (no Tailwind needed — pure CSS)
- HTML5 Audio API
- Context API for state management
- localStorage for persistence
