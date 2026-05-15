/**
 * @file views/LobbyView.tsx
 */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { useQuiz } from '../hooks/useQuiz';
import { User as UserIcon, Copy, Play, ArrowLeft, Share2, ShieldCheck } from 'lucide-react';
import { GameLoader } from '../components/GameLoader';
import type { Quiz } from '../types/quiz';
import type { GameConfig } from '../types/game';
import type { User } from '../types/auth';
import styles from './LobbyView.module.css';

interface LobbyProps {
  config?: GameConfig;
  user: User;
  onExit: () => void;
}

export const LobbyView = ({ config, user, onExit }: LobbyProps) => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();

  const { session, isLoading: roomLoading, create, join, isHost, error } = useRoom(user?.id);
  
  const { getFullQuiz, loading: quizLoading } = useQuiz();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const init = async () => {
      if (config && !roomCode) {
        initialized.current = true;
        await create(config.quizId, config.mode, config.modifier);
      }
      else if (roomCode) {
        initialized.current = true;
        await join(roomCode);
      }
    };
    
    init();
  }, [roomCode, config]);

  useEffect(() => {
    if (roomCode) return; 

    if (session?.roomCode) {
      navigate(`/lobby/${session.roomCode}`, { replace: true });
    }
  }, [session?.roomCode, roomCode, navigate]);

  useEffect(() => {
    if (session?.quizId) {
      getFullQuiz(session.quizId).then(setQuiz);
    }
  }, [session?.quizId]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={onExit}>Retour à l'accueil</button>
      </div>
    );
  }

  if (roomLoading && !session) return <GameLoader />;
  if (quizLoading || !session) return <GameLoader />;

  const hostPlayer = session.players.find(p => p.isHost);
  const hostName = hostPlayer?.username || "Inconnu";

  const copyToClipboard = () => {
    if (session.roomCode) {
      navigator.clipboard.writeText(session.roomCode);
    }
  };

  const PlayerCode = () => (
    <div className={styles.codeContainer}>
      <span className={styles.codeLabel}>CODE</span>
      <span className={styles.codeValue}>{session.roomCode}</span>
      <button className={styles.miniCopy} title="Copier le code" onClick={copyToClipboard}>
        <Copy size={14} />
      </button>
    </div>
  );

  return (
    <div className={styles.lobbyWrapper}>
      <header className={styles.topBar}>
        <button onClick={onExit} className={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.gameInfo}>
          <span className={styles.badge}>{session.modifier}</span>
          <p>Salle de {hostName}</p>
        </div>
        <div className={styles.desktopCode}>
          <PlayerCode />
        </div>
      </header>

      <main className={styles.mainContent}>
        {quiz && (
            <div className={styles.mobileQuizHeader}>
                <div className={styles.mobileQuizContent}>
                    <img src={quiz.imageUrl} alt="" />
                    <div className={styles.mobileQuizInfo}>
                        <h4>{quiz.title}</h4>
                    </div>
                </div>
                <div className={styles.mobileCodeWrapper}>
                    <PlayerCode />
                </div>
            </div>
        )}

        <section className={styles.playersSection}>
          <div className={styles.sectionHeader}>
            <h3>Joueurs</h3>
            <span className={styles.count}>{session.players.length} / 8</span>
          </div>
          
          <div className={styles.scrollArea}>
            {session.players.map((p) => (
              <div key={p.id} className={styles.playerCard}>
                <div className={`${styles.playerAvatar} ${p.isHost ? styles.hostAvatar : ''}`}>
                   {p.isHost ? <ShieldCheck size={20} /> : <UserIcon size={20} />}
                </div>
                <div className={styles.playerName}>
                  <span>{p.username}</span>
                  {p.id === user?.id && <small>(Vous)</small>}
                </div>
                <div className={`${styles.statusDot} ${p.isReady ? styles.active : ''}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar uniquement visible sur Desktop via CSS */}
        <aside className={styles.detailsSidebar}>
            {quiz && (
              <div className={styles.quizPreviewSmall}>
                  <img src={quiz.imageUrl} alt={quiz.title} />
                  <div className={styles.quizMeta}>
                      <h4>{quiz.title}</h4>
                      <p>{quiz.questions.length} questions • {session.mode}</p>
                  </div>
              </div>
            )}
            <button className={styles.shareBtn}>
                <Share2 size={18} /> Inviter des amis
            </button>
        </aside>

        <button className={styles.mobileShareBtn}>
            <Share2 size={18} /> Inviter des amis
        </button>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
            {session.players.find(p => p.id === user?.id)?.isHost ? (
            <button className={styles.launchBtn} onClick={() => console.log("Start Game")}>
                <Play size={20} fill="currentColor" />
                LANCER LA PARTIE
            </button>
            ) : (
            <div className={styles.waitingMessage}>
                <div className={styles.pulse} />
                <span>En attente du leader...</span>
            </div>
            )}
        </div>
      </footer>
    </div>
  );
};