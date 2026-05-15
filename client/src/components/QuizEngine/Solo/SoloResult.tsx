/**
 * @file SoloResult.tsx
 */
import { motion } from "framer-motion";
import { Trophy, RefreshCcw, Home, Star } from "lucide-react";
import styles from "./SoloEngine.module.css";

interface SoloResultProps {
  score: number;
  onExit: () => void;
}

export const SoloResult = ({ score, onExit }: SoloResultProps) => {
  return (
    <div className={styles.resultScreen}>
      {/* Background */}
      <div className={styles.uiGlow} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.resultContent}
      >
        {/* Header de fin */}
        <div className={styles.resultHeader}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Trophy size={120} className={styles.mainTrophy} />
          </motion.div>
          <h1 className={styles.hugeTitle}>Terminé !</h1>
        </div>

        {/* Score */}
        <div className={styles.scoreHero}>
          <span className={styles.scoreLabel}>TON SCORE</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>

        {/* Stats secondaires */}
        <div className={styles.minimalStats}>
            <div className={styles.miniStat}>
                <Star size={18} />
                <span>Nouveau record ?</span>
            </div>
        </div>

        {/* Actions */}
        <div className={styles.actionStack}>
          <button className={styles.btnPrimary} onClick={() => window.location.reload()}>
            <RefreshCcw size={22} />
            REJOUER
          </button>
          
          <button className={styles.btnGhost} onClick={onExit}>
            <Home size={22} />
            QUITTER LE QUIZ
          </button>
        </div>
      </motion.div>
    </div>
  );
};