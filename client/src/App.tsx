/**
 * @file App.tsx
 */
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { HubView } from "./views/HubView";
import { SoloView } from "./views/SoloView";
import { LobbyView } from "./views/LobbyView";
import StudioView from "./views/Studio/StudioView";
import { AuthModal } from "./components/AuthModal";
import type { GameConfig } from "./types/game";
import { useAuth } from "./hooks/useAuth";

// Pour protéger les routes
const ProtectedRoute = ({ children, isLoggedIn, onAuthRequired }: any) => {
  if (!isLoggedIn) {
    onAuthRequired();
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const navigate = useNavigate();
  const { user, isPending, error, setError, signIn, signUp, signOut, isLoggedIn } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentGameConfig, setCurrentGameConfig] = useState<GameConfig | null>(null);

  const handleStartGame = (config: GameConfig) => {
    setCurrentGameConfig(config);
    if (config.mode === 'SOLO') navigate(`/solo/${config.quizId}`);
    else if (config.mode === 'MULTIPLAYER') navigate('/lobby');
  };

  return (
    <div className="app-wrapper">
      <Routes>
        {/* Accueil */}
        <Route path="/" element={
          <HubView 
            isLoggedIn={isLoggedIn}
            username={user?.username || "Invité"}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onStartGame={handleStartGame}
            onJoinGame={() => navigate('/join')}
            onLanguageClick={() => console.log("Langue")}
            onLogoutClick={signOut}
            onStudioClick={() => navigate('/studio')}
          />
        } />

        {/* Mode Solo */}
        <Route path="/solo/:quizId" element={
          <SoloView onExit={() => navigate('/')} />
        } />

        {/* Studio */}
        <Route path="/studio" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} onAuthRequired={() => setIsAuthModalOpen(true)}>
            <StudioView onExit={() => navigate('/')} />
          </ProtectedRoute>
        } />

        {/* Lobby */}
        <Route path="/lobby" element={
          currentGameConfig && user ? (
            <LobbyView config={currentGameConfig} user={user} onExit={() => navigate('/')} />
          ) : <Navigate to="/" />
        } />

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { setIsAuthModalOpen(false); setError(null); }}
        onLogin={async (email, password) => { await signIn({ email, password }); setIsAuthModalOpen(false); }}
        onSignUp={async (username, email, password) => { await signUp({ username, email, password }); setIsAuthModalOpen(false); }}
        error={error}
        onForgotPassword={async (e) => console.log("Reset", e)}
        isLoading={isPending}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}