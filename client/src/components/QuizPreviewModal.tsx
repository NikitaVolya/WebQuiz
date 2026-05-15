/**
 * @file QuizPreviewModal.tsx
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Users, Zap, Info, Clock, Tv, Target, Crown, BarChart3 } from "lucide-react";
import styles from "./QuizPreviewModal.module.css";
import { quizService } from "../services/quizService"; 
import type { Quiz } from "../types/quiz";
import type { GameMode, GameModifier } from "../types/game";

interface QuizPreviewModalProps {
  isOpen: boolean;
  quizId: number | null;
  onClose: () => void;
  onConfirm: (config: { quizId: number; mode: GameMode; modifier: GameModifier }) => void;
}

export const QuizPreviewModal = ({ isOpen, quizId, onClose, onConfirm }: QuizPreviewModalProps) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>('SOLO');
  const [selectedModifier, setSelectedModifier] = useState<GameModifier>('CLASSIC');

  useEffect(() => {
    if (isOpen && quizId) {
      quizService.getQuizDetails(quizId).then(setQuiz);
    } else {
      setQuiz(null);
    }
  }, [isOpen, quizId]);

  if (!isOpen || !quiz) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

          <motion.div 
            className={styles.wideCard}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>

            {/* CÔTÉ GAUCHE : INFO QUIZ */}
            <div className={styles.sideInfo}>
              <div className={styles.imageWrapper}>
                <img src={quiz.imageUrl} alt={quiz.title} />
                <div className={styles.imageOverlay}>
                  <span className={styles.badge}></span>
                </div>
              </div>
              <div className={styles.infoContent}>
                <h2>{quiz.title}</h2>
                <div className={styles.quickStats}>
                <div className={styles.statItem}>
                  <Info size={18} />
                  <span>{quiz.questions.length} Questions</span>
                </div>
                <div className={styles.statItem}>
                  <Clock size={18} />
                  <span>~5 min</span>
                </div>
                <div className={styles.statItem}>
                  <BarChart3 size={18} />
                  <span>Moyen</span>
                </div>
              </div>
                <p className={styles.descText}>{quiz.description}</p>
              </div>
            </div>

            {/* CÔTÉ DROIT : CONFIGURATION */}
            <div className={styles.configArea}>
              <div className={styles.configSection}>
                <h3 className={styles.label}>1. Choisir le Mode</h3>
                <div className={styles.choiceGrid}>
                  <button className={`${styles.choiceBtn} ${selectedMode === 'SOLO' ? styles.active : ''}`} onClick={() => setSelectedMode('SOLO')}>
                    <User size={20} /> <span>Solo</span>
                  </button>
                  <button className={`${styles.choiceBtn} ${selectedMode === 'MULTIPLAYER' ? styles.active : ''}`} onClick={() => setSelectedMode('MULTIPLAYER')}>
                    <Users size={20} /> <span>Online</span>
                  </button>
                  <button className={`${styles.choiceBtn} ${selectedMode === 'PARTY' ? styles.active : ''}`} onClick={() => setSelectedMode('PARTY')}>
                    <Tv size={20} /> <span>Party</span>
                  </button>
                </div>
              </div>

              <div className={styles.configSection}>
                <h3 className={styles.label}>2. Choisir la Variante</h3>
                <div className={styles.choiceGrid}>
                  <button className={`${styles.choiceBtn} ${selectedModifier === 'CLASSIC' ? styles.active : ''}`} onClick={() => setSelectedModifier('CLASSIC')}>
                    <Target size={20} /> <span>Classic</span>
                  </button>
                  <button className={`${styles.choiceBtn} ${selectedModifier === 'CHAOS' ? styles.active : ''}`} onClick={() => setSelectedModifier('CHAOS')}>
                    <Zap size={20} /> <span>Chaos</span>
                  </button>
                  <button className={`${styles.choiceBtn} ${selectedModifier === 'BATTLE_ROYALE' ? styles.active : ''}`} onClick={() => setSelectedModifier('BATTLE_ROYALE')}>
                    <Crown size={20} /> <span>Royal</span>
                  </button>
                </div>
              </div>

              <button 
                className={styles.finalStartBtn}
                onClick={() => onConfirm({ quizId: quiz.id, mode: selectedMode, modifier: selectedModifier })}
              >
                Lancer la partie
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};