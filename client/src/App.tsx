/**
 * @file App.tsx
 */
import { useState } from "react";
import { HubView } from "./views/HubView";
import { SoloView } from "./views/SoloView";
import { AuthModal } from "./components/AuthModal";
import type { GameMode, GameModifier, GameConfig } from "./types/game";
import { useAuth } from "./hooks/useAuth";
import { LobbyView } from "./views/LobbyView";

function App() {
  // Authentification
  const { 
    user, 
    isPending, 
    error, 
    setError, 
    signIn,
    signUp,
    signOut,
    isLoggedIn 
  } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Navigation
  const [view, setView] = useState<'hub' | 'solo' | 'lobby' | 'party' | 'game'>('hub');
  
  // Jeu
  const [currentGameConfig, setCurrentGameConfig] = useState<GameConfig | null>(null);

  const handleStartGame = (config: GameConfig) => {
    setCurrentGameConfig(config);

    switch (config.mode) {
      case 'SOLO':
        setView('solo');
        break;
      case 'MULTIPLAYER':
        setView('lobby');
        break;
      case 'PARTY':
        setView('party');
        break;
      default:
        setView('hub');
    }
  };

  return (
    <div className="app-wrapper">
      
      {/* ROUTAGE DES VUES */}
      {view === 'hub' && (
        <HubView 
          isLoggedIn={isLoggedIn}
          username={user?.username || "Invité"}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onStartGame={handleStartGame}
          onJoinGame={() => console.log("Rejoindre")}
          onLanguageClick={() => console.log("Langue")}
          onLogoutClick={signOut}
        />
      )}

      {view === 'solo' && currentGameConfig && (
        <SoloView 
          quizId={currentGameConfig.quizId} 
          onExit={() => setView('hub')} 
        />
      )}

      {view === 'lobby' && currentGameConfig && user!=null &&(
        <LobbyView
          config={currentGameConfig} 
          user={user}
          onExit={() => {
            setView('hub');
            setCurrentGameConfig(null);
          }} 
        />
      )}

      {/* MODALES GLOBALES */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { 
          setIsAuthModalOpen(false); 
          setError(null); 
        }}
        onLogin={async (email, password) => { 
          await signIn({ email, password }); 
          setIsAuthModalOpen(false); 
        }}
        onSignUp={async (username, email, password) => { 
          await signUp({ username, email, password }); 
          setIsAuthModalOpen(false); 
        }}
        onForgotPassword={async (e) => console.log("Reset", e)}
        error={error}
        isLoading={isPending}
      />
    </div>
  );
}

export default App;