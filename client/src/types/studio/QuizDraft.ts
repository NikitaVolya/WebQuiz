/**
 * @file types/studio/QuizDraft.ts
 */

export interface DraftSummary {
  id: string;
  title: string;
  description: string;
  categoryId: number | null;
  imageUrl: string;
  isPublished: boolean;
  isPrivate: boolean;
  questionsCount: number;

  updatedAt?: string;
  createdAt?: string;
}

export interface AnswerDraft {
  tempId: string;
  answerText: string;
  isCorrect: boolean;
}

export interface QuestionDraft {
  tempId: string;
  questionText: string;
  imageUrl: string;
  timerSeconds: number;
  pointsValue: number;
  answers: AnswerDraft[];
}

export interface QuizDraft {
  id: string;
  title: string;
  description: string;
  categoryId: number | null;
  imageUrl: string;
  isPublished: boolean;
  isPrivate?: boolean;
  questionsCount?: number;
  
  questions: QuestionDraft[];
  
  updatedAt?: string;
  createdAt?: string;
}