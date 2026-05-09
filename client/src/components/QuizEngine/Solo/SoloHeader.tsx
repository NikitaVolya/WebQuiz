/**
 * @file SoloHeader.tsx
 */
import { X, Globe, Trophy, Hash } from "lucide-react";
import styles from "./SoloEngine.module.css";

interface SoloHeaderProps {
  score: number;
  currentIndex: number;
  totalQuestions: number;
  quizTitle: string;
  quizImage: string;
  onExit: () => void;
}

export const SoloHeader = ({ 
  score, 
  currentIndex, 
  totalQuestions, 
  quizTitle, 
  quizImage,
  onExit 
}: SoloHeaderProps) => {
  return (
    <header className={styles.gameHeader}>
      {/* BLOC GAUCHE : Stats */}
      <div className={styles.headerSection}>
        <div className={styles.statGroup}>
          <Trophy size={16} className={styles.iconGold} />
          <span>{score}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.statGroup}>
          <Hash size={16} />
          <span>{currentIndex + 1}/{totalQuestions}</span>
        </div>
      </div>

      {/* BLOC DROITE : Quiz Info & Actions */}
      <div className={styles.headerSection}>
        <div className={styles.quizInfo}>
          <div className={styles.miniatureBox}>
            <img src={quizImage} alt="thumbnail" className={styles.miniatureImg} />
          </div>
          <span className={styles.quizTitleDisplay}>{quizTitle}</span>
        </div>
        
        <div className={styles.actionsGroup}>
          <button className={styles.iconBtn} title="Langue"><Globe size={18} /></button>
          <button className={`${styles.iconBtn} ${styles.exitBtn}`} onClick={onExit}><X size={20} /></button>
        </div>
      </div>
    </header>
  );
};