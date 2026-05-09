/**
 * @file hooks/useSoloGame.ts
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { quizService } from '../services/quizService';
import type { Quiz, Question } from '../types/quiz';

export const useSoloGame = (quizId: number) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'play' | 'result'>('play');
  const [timer, setTimer] = useState(100);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    let isMounted = true;

    const loadQuiz = async () => {
      setLoading(true);
      try {
        const data = await quizService.getQuizDetails(quizId);
        if (isMounted) setQuiz(data);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadQuiz();
    return () => { isMounted = false; };
  }, [quizId]);

  useEffect(() => {
    if (phase !== 'play' || isFinished || loading || !!error) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          setPhase('result');
          return 0;
        }
        return prev - 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [phase, currentIndex, isFinished, loading, error]);

  const handleAnswer = useCallback((answerId: number | null) => {
    if (!quiz || phaseRef.current !== 'play' || isFinished) return;

    const currentQuestion: Question = quiz.questions[currentIndex];
    
    const selectedAnswer = currentQuestion.answers.find(
      (a) => String(a.id) === String(answerId)
    );

    const isCorrect = selectedAnswer?.isCorrect === true;

    if (isCorrect) {
      const pointsGagnes = 100 + Math.floor(timer * 10);
      setScore(s => s + pointsGagnes);
      console.log(`Bonne réponse ! Points gagnés : ${pointsGagnes}`);
    } else {
      console.log("Mauvaise réponse...");
    }

    setPhase('result');

    setTimeout(() => {
      if (currentIndex < quiz.questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setTimer(100);
        setPhase('play');
      } else {
        setIsFinished(true);
      }
    }, 2000);
  }, [quiz, currentIndex, isFinished, timer]);

  return {
    quiz,
    currentQuestion: quiz?.questions[currentIndex] || null,
    phase,
    timer,
    score,
    handleAnswer,
    isFinished,
    currentIndex,
    loading,
    error,
    totalQuestions: quiz?.questions.length || 0
  };
};