/**
 * @file QuizCard.tsx
 */
import { memo } from 'react';
import { PlayCircle } from 'lucide-react';
import { type Quiz } from '../types/quiz';
import styles from './QuizCard.module.css';

interface QuizCardProps {
  quiz: Quiz;
  onClick: (id: number) => void;
}

export const QuizCard = memo(({ quiz, onClick }: QuizCardProps) => {
  const optimizedImage = quiz?.imageUrl?.includes('unsplash')
    ? `${quiz.imageUrl.split('?')[0]}?w=400&q=70&fit=crop`
    : quiz?.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className={styles.quizCard} onClick={() => onClick(quiz.id)}>
      <div className={styles.cardImageWrapper}>
        <img 
          src={optimizedImage} 
          alt={quiz.title} 
          loading="lazy"
        />
        <div className={styles.playOverlay}>
          <PlayCircle size={40} color="#fff" />
        </div>
      </div>
      <div className={styles.cardContent}>
        <span className={styles.categoryBadge}>Quiz</span>
        <h3>{quiz.title}</h3>
        <p>{quiz.description}</p>
        <div className={styles.cardFooter}>
          <span>{quiz.questionsCount} Questions</span>
        </div>
      </div>
    </div>
  );
});