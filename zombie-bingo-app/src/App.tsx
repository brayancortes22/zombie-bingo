import { useState, useEffect, useRef } from 'react'
import { soundEngine } from './services/soundEngine'
import { BloodRain } from './components/effects/BloodRain'
import { LoginView } from './components/views/LoginView'
import { HomeView } from './components/views/HomeView'
import { PotionsGuideView } from './components/views/PotionsGuideView'
import { CreateRoomView } from './components/views/CreateRoomView'
import { JoinRoomView } from './components/views/JoinRoomView'
import { LobbyView } from './components/views/LobbyView'
import { GameView } from './components/views/GameView'
import { FriendsListView } from './components/views/FriendsListView'
import type { ViewMode, UserSession, RoomData } from './types/navigation'

const SESSION_STORAGE_KEY = 'zombie_bingo_user_session'

const DEFAULT_GUEST: UserSession = {
  id: 'guest',
  username: 'Superviviente',
  avatar: '/img/avatar1.jpg',
  isAuthenticated: false,
}

export function App() {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // ignore
    }
    return null
  })
  const [currentView, setCurrentView] = useState<ViewMode>('login')
  const [activeRoom, setActiveRoom] = useState<RoomData | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)

  // Background Soundtrack (sonido_juego3.mp3)
  useEffect(() => {
    const audio = new Audio('/sound/sonido_juego3.mp3')
    audio.loop = true
    audio.volume = 0.35
    bgMusicRef.current = audio

    const playMusic = () => {
      if (soundEnabled) {
        audio.play().catch(() => {})
      }
    }

    playMusic()

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  useEffect(() => {
    if (bgMusicRef.current) {
      if (soundEnabled) {
        bgMusicRef.current.play().catch(() => {})
      } else {
        bgMusicRef.current.pause()
      }
    }
  }, [soundEnabled])

  const handleToggleSound = () => {
    const next = !soundEnabled
    soundEngine.enabled = next
    setSoundEnabled(next)
  }

  const handleLoginSuccess = (loggedInUser: UserSession) => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser))
    } catch {
      // ignore
    }
    setUser(loggedInUser)
    setCurrentView('home')
  }

  const handlePlaySolo = () => {
    setActiveRoom(null)
    setCurrentView('game')
  }

  const handleCreateRoom = (room: RoomData) => {
    setActiveRoom(room)
    setCurrentView('lobby')
  }

  const handleJoinRoom = (room: RoomData) => {
    setActiveRoom(room)
    setCurrentView('lobby')
  }

  const handleStartRoomGame = () => {
    setCurrentView('game')
  }

  const handleLeaveRoom = () => {
    setActiveRoom(null)
    setCurrentView('home')
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // ignore
    }
    setUser(null)
    setCurrentView('login')
  }

  const activeUser = user || DEFAULT_GUEST

  return (
    <div className="zombie-bg min-h-screen text-slate-100 flex flex-col relative selection:bg-red-500 selection:text-white">
      {/* Falling Blood Rain from Original goteo.css */}
      <BloodRain />

      {/* Render Current Active View */}
      {currentView === 'login' && (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onPlayGuest={() => {
            const guestUser: UserSession = {
              id: 'guest-' + Date.now(),
              username: 'Invitado_' + Math.floor(100 + Math.random() * 900),
              avatar: '/img/avatar3.jpg',
              isAuthenticated: false,
            }
            setUser(guestUser)
            setCurrentView('home')
          }}
        />
      )}

      {currentView === 'home' && (
        <HomeView
          user={activeUser}
          onPlaySolo={handlePlaySolo}
          onCreateRoom={() => setCurrentView('create-room')}
          onJoinRoom={() => setCurrentView('join-room')}
          onOpenPotionsGuide={() => setCurrentView('potions-guide')}
          onOpenFriendsList={() => setCurrentView('friends-list')}
          onLogout={handleLogout}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {currentView === 'friends-list' && (
        <FriendsListView onBack={() => setCurrentView('home')} />
      )}

      {currentView === 'potions-guide' && (
        <PotionsGuideView onBack={() => setCurrentView('home')} />
      )}

      {currentView === 'create-room' && (
        <CreateRoomView
          user={activeUser}
          onCreateRoom={handleCreateRoom}
          onCancel={() => setCurrentView('home')}
        />
      )}

      {currentView === 'join-room' && (
        <JoinRoomView
          user={activeUser}
          onJoinSuccess={handleJoinRoom}
          onCancel={() => setCurrentView('home')}
        />
      )}

      {currentView === 'lobby' && activeRoom && (
        <LobbyView
          user={activeUser}
          room={activeRoom}
          onStartGame={handleStartRoomGame}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      {currentView === 'game' && (
        <div className="p-3 sm:p-5 flex-1 flex flex-col">
          <GameView
            room={activeRoom}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onExitGame={() => setCurrentView('home')}
          />
        </div>
      )}
    </div>
  )
}

export default App
