import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { SoloProgressBar } from "./SoloProgressBar";
import styles from "./SoloEngine.module.css";
import { SoloHeader } from "./SoloHeader";
import type { Question, Answer } from "../../../types/quiz";

interface SoloEngineProps {
  question: Question;
  phase: 'play' | 'result';
  timer: number;
  onSelectAnswer: (answerId: number | null) => void;
  score: number;
  currentIndex: number;
  totalQuestions: number;
  quizTitle: string;
  quizImage: string;
  onExit: () => void;
}

export const SoloEngine = ({ 
  question, 
  phase, 
  timer, 
  onSelectAnswer, 
  score, 
  currentIndex, 
  totalQuestions, 
  quizTitle, 
  quizImage,
  onExit 
}: SoloEngineProps) => {
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);

  useEffect(() => {
    if (phase === 'play') setSelectedAnswerId(null);
  }, [question.id, phase]);

  useEffect(() => {
    if (timer === 0 && phase === 'play' && selectedAnswerId === null) {
      onSelectAnswer(null); 
    }
  }, [timer, phase, selectedAnswerId, onSelectAnswer]);

  const handlePress = (answerId: number) => {
    if (phase !== 'play') return;
    setSelectedAnswerId(answerId);
    onSelectAnswer(answerId);
  };

  return (
    <div className={styles.engineWrapper}>
      {/* 1. HEADER DÉTAILLÉ */}
      <SoloHeader
        score={score}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        quizTitle={quizTitle}
        quizImage={quizImage}
        onExit={onExit}
      />

      <SoloProgressBar timer={timer} />

      {/* 2. IMAGE (CENTRE) */}
      <div className={styles.imageContainer}>
        {question.imageUrl ? (
          <motion.img 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={question.imageUrl} 
            alt="Question illustration" 
            className={styles.qImage}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={styles.placeholderImage}>
            <span>Pas d'illustration</span>
          </div>
        )}
      </div>

      {/* 3. QUESTION */}
      <h2 className={styles.questionText}>{question.questionText}</h2>

      {/* 4. RÉPONSES (GRILLE 2x2) */}
      <div className={styles.answersGrid}>
        {question.answers.map((answer: Answer, index: number) => {
          let status: 'idle' | 'correct' | 'wrong' | 'disabled' = 'idle';

          if (phase === 'result') {
            if (answer.isCorrect) {
                status = 'correct';
            } else if (answer.id === selectedAnswerId) {
                status = 'wrong';
            } else {
                status = 'disabled';
            }
          }

          return (
            <SoloAnswerCard 
              key={answer.id}
              index={index}
              text={answer.answerText}
              status={status}
              onClick={() => handlePress(answer.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

const SoloAnswerCard = ({ text, index, status, onClick }: any) => {
  const letter = String.fromCharCode(65 + index);
  const variants: Variants = {
    idle: { scale: 1, backgroundColor: "var(--bg-card)" },
    correct: { backgroundColor: "#22c55e", color: "#fff" },
    wrong: { backgroundColor: "#ef4444", color: "#fff", x: [0, -5, 5, -5, 5, 0] },
    disabled: { opacity: 0.4 }
  };

  return (
    <motion.button
      className={styles.answerCard}
      variants={variants}
      animate={status}
      onClick={status === 'idle' ? onClick : undefined}
    >
      <span className={styles.answerLetter}>{letter}</span>
      <span className={styles.answerText}>{text}</span>
    </motion.button>
  );
};