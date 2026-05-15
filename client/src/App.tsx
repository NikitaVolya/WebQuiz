/**
 * @file App.tsx
 */
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { HubView } from "./views/HubView";
import { SoloView } from "./views/SoloView";
import { LobbyView } from "./views/LobbyView";
import StudioView from "./views/Studio/StudioView";
import { JoinModal } from "./components/JoinModal";
import { AuthModal } from "./components/AuthModal";
import type { GameConfig } from "./types/game";
import { useAuth } from "./hooks/useAuth";
import { useRoom } from "./hooks/useRoom";

// Pour protéger les routes
const ProtectedRoute = ({ children, isLoggedIn, onAuthRequired }: any) => {
  useEffect(() => {
    if (!isLoggedIn) {
      onAuthRequired();
    }
  }, [isLoggedIn, onAuthRequired]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const navigate = useNavigate();
  const { user, isPending: authLoading, error: authError, setError: setAuthError, signIn, signUp, signOut, isLoggedIn } = useAuth();
  
  const { join, isLoading: roomLoading, error: roomError } = useRoom(user?.id);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  const [currentGameConfig, setCurrentGameConfig] = useState<GameConfig | null>(null);

  const requireAuth = (targetPath: string) => {
    setRedirectTarget(targetPath);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = async (email: string, password: string) => {
    const success = await signIn({ email, password });
    if (success) {
      setIsAuthModalOpen(false);
      if (redirectTarget) {
        navigate(redirectTarget);
        setRedirectTarget(null);
      }
    }
  };

  const handleStartGame = (config: GameConfig) => {
    if (config.mode === 'SOLO') {
      navigate(`/solo/${config.quizId}`);
    } else if (config.mode === 'MULTIPLAYER') {
      setCurrentGameConfig(config);
      navigate('/lobby'); 
    }
  };

  const handleJoinSubmit = async (code: string) => {
    if (!isLoggedIn) {
      setIsJoinModalOpen(false);
      requireAuth(`/lobby/${code}`);
      return;
    }

    await join(code);
    
    if (!roomError) {
      setIsJoinModalOpen(false);
      navigate(`/lobby/${code}`);
    }
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
            onJoinGame={() => setIsJoinModalOpen(true)}
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
          <ProtectedRoute isLoggedIn={isLoggedIn} onAuthRequired={() => requireAuth('/studio')}>
            <StudioView onExit={() => navigate('/')} />
          </ProtectedRoute>
        } />

        {/* Lobby - Protégé */}
        <Route path="/lobby" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} onAuthRequired={() => requireAuth('/lobby')}>
            <LobbyView config={currentGameConfig || undefined} user={user!} onExit={() => navigate('/')} />
          </ProtectedRoute>
        } />

        <Route path="/lobby/:roomCode" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} onAuthRequired={() => requireAuth(window.location.pathname)}>
            <LobbyView user={user!} onExit={() => navigate('/')} />
          </ProtectedRoute>
        } />

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { 
          setIsAuthModalOpen(false); 
          setAuthError(null); 
          setRedirectTarget(null);
        }}
        onLogin={handleLoginSuccess}
        onSignUp={async (username, email, password) => { 
          await signUp({ username, email, password }); 
          setIsAuthModalOpen(false); 
        }}
        error={authError}
        onForgotPassword={async (e) => console.log("Reset", e)}
        isLoading={authLoading}
      />

      <JoinModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinSubmit}
        isLoading={roomLoading}
        error={roomError}
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