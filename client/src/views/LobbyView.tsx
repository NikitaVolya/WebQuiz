/**
 * @file views/LobbyView.tsx
 */
import { useState, useEffect } from 'react';
import { useRoom } from '../hooks/useRoom';
import { useQuiz } from '../hooks/useQuiz';
import { User as UserIcon, Copy, Play, ArrowLeft, Share2, ShieldCheck } from 'lucide-react';
import { GameLoader } from '../components/GameLoader';
import type { Quiz } from '../types/quiz';
import type { GameConfig } from '../types/game';
import type { User } from '../types/auth';
import styles from './LobbyView.module.css';

interface LobbyProps {
  config: GameConfig;
  user: User;
  onExit: () => void;
}

export const LobbyView = ({ config, user, onExit }: LobbyProps) => {
  // 1. Hook de Salle
  const { session, isLoading: roomLoading, create, isHost } = useRoom(user?.id);
  
  // 2. Hook de Quiz
  const { getFullQuiz, loading: quizLoading } = useQuiz();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const init = async () => {
      // Charger les détails du quiz
      getFullQuiz(config.quizId).then(setQuiz);

      // Créer la salle
      await create(config.quizId, config.mode, config.modifier);
    };

    init();
  }, [config.quizId]);

  // Si on charge ou si la session n'est pas encore prête
  if (roomLoading || quizLoading || !session) return <GameLoader />;

  const PlayerCode = () => (
    <div className={styles.codeContainer}>
      <span className={styles.codeLabel}>CODE</span>
      <span className={styles.codeValue}>{session.roomCode}</span>
      <button className={styles.miniCopy} title="Copier le code">
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
          <span className={styles.badge}>{config.modifier}</span>
          <p>Salle de {session.players[0].username}</p>
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
                      <p>{quiz.questions.length} questions • {config.mode}</p>
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