import { type Question } from './Question';

export interface Quiz {
  id: number;
  categoryId: number;
  creatorId: number;
  title: string;
  questionsCount: number;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  questions: Question[];
}