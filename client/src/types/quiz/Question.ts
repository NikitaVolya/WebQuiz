import { type Answer } from './Answer';

export interface Question {
  id: number;
  quizId: number;
  questionText: string;
  imageUrl?: string;
  timerSeconds: number;
  pointsValue: number;
  answers: Answer[];
}