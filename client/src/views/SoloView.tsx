/**
 * @file SoloView.tsx
 */
import { AnimatePresence } from "framer-motion";
import { SoloEngine } from '../components/QuizEngine/Solo/SoloEngine';
import { SoloResult } from '../components/QuizEngine/Solo/SoloResult';
import { useSoloGame } from '../hooks/useSoloGame';
import { GameLoader } from '../components/GameLoader';

interface SoloViewProps {
  quizId: number;
  onExit: () => void;
}

export const SoloView = ({ quizId, onExit }: SoloViewProps) => {
  // Le hook gère : fetch du quiz, timer, score et progression
  const game = useSoloGame(quizId);

  // Écran de chargement
  if (game.loading) {
    return <GameLoader />;
  }

  // Gestion d'erreur (si le quiz n'existe pas ou ID invalide)
  if (game.error || !game.quiz) {
    return (
      <div className="error-container">
        <p>{game.error || "Impossible de charger le quiz."}</p>
        <button onClick={onExit} className="btn-error">Retour au Hub</button>
      </div>
    );
  }

  // Écran de fin (Résultats)
  if (game.isFinished) {
    return (
      <div className="solo-layout">
        <SoloResult 
          score={game.score}
          onExit={onExit} 
        />
      </div>
    );
  }

  return (
    <div className="solo-layout">
      <AnimatePresence mode="wait">
        <SoloEngine 
          key={game.currentQuestion?.id || 'empty'}
          question={game.currentQuestion!}
          phase={game.phase}
          timer={game.timer}
          onSelectAnswer={game.handleAnswer}
          score={game.score}
          currentIndex={game.currentIndex}
          totalQuestions={game.totalQuestions}
          quizTitle={game.quiz.title}
          quizImage={game.quiz.imageUrl}
          onExit={onExit}
        />
      </AnimatePresence>
    </div>
  );
};