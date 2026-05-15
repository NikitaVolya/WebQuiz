/**
 * @file DiscoverSection.tsx
 */
import { type Quiz } from "../types/quiz";
import { Search } from 'lucide-react';
import styles from './DiscoverSection.module.css';
import { QuizCard } from './QuizCard';

interface DiscoverSectionProps {
  quizzes: Quiz[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectQuiz: (id: number) => void;
  hideHeader?: boolean;
}

export const DiscoverSection = ({ 
  quizzes,
  searchTerm,
  onSearchChange,
  onSelectQuiz,
  hideHeader = false
}: DiscoverSectionProps) => {

  return (
    <section className={styles.discoverWrapper}>
      {!hideHeader && <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Découvrir</h2>
        
        {/* Barre de recherche */}
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Rechercher un quiz (Tech, Cinéma...)" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>}

      {/* Grille de Quiz */}
      <div className={styles.quizGrid}>
        {quizzes.map((quiz) => (
          <QuizCard 
            key={quiz.id} 
            quiz={quiz} 
            onClick={onSelectQuiz} 
          />
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className={styles.noResults}>Aucun quiz trouvé pour "{searchTerm}"</div>
      )}
    </section>
  );
};