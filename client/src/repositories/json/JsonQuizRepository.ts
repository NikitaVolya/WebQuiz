import { db } from '../../infra/localStorageDB';
import type { IQuizRepository } from '../IQuizRepository';
import type { Quiz, Category, Question, Answer } from '../../types/quiz';

import { MOCK_QUIZZES } from '../../data/mockQuizzes';
import { MOCK_CATEGORIES } from '../../data/mockCategories';
import { MOCK_QUESTIONS } from '../../data/mockQuestions';
import { MOCK_ANSWERS } from '../../data/mockAnswers';

const QUIZ_KEY = 'quizzes';
const CAT_KEY = 'categories';
const QUEST_KEY = 'questions';
const ANS_KEY = 'answers';

db.init(QUIZ_KEY, MOCK_QUIZZES);
db.init(CAT_KEY, MOCK_CATEGORIES);
db.init(QUEST_KEY, MOCK_QUESTIONS);
db.init(ANS_KEY, MOCK_ANSWERS);

// --- MAPPERS ---

const mapCategory = (raw: any): Category => ({
  id: raw.id,
  name: raw.name,
  description: raw.description,
  imageUrl: raw.image_url,
  colorCode: raw.color_code,
  slug: raw.slug,
  count: raw.count
});

/**
 * Reconstruit un objet Question complet avec ses réponses
 */
const mapQuestion = (qRaw: any, allAnswers: any[]): Question => ({
  id: qRaw.id,
  quizId: qRaw.quiz_id,
  questionText: qRaw.question_text,
  imageUrl: qRaw.image_url,
  timerSeconds: qRaw.timer_seconds,
  pointsValue: qRaw.points_value,
  answers: allAnswers
    .filter(a => a.question_id === qRaw.id)
    .map((a: any): Answer => ({
      id: a.id,
      questionId: a.question_id,
      answerText: a.answer_text,
      isCorrect: Boolean(a.is_correct)
    }))
});

/**
 * Reconstruit un Quiz. 
 * Si 'withDetails' est vrai, on va chercher les questions et réponses (JOINS)
 */
const mapQuiz = (qRaw: any, withDetails = false): Quiz => {
  const quiz: Quiz = {
    id: qRaw.id,
    categoryId: qRaw.category_id,
    creatorId: qRaw.creator_id,
    title: qRaw.title,
    questionsCount: qRaw.questions_count,
    description: qRaw.description,
    imageUrl: qRaw.image_url,
    isPublic: Boolean(qRaw.is_public),
    questions: []
  };

  if (withDetails) {
    const allQuestions = db.get<any>(QUEST_KEY);
    const allAnswers = db.get<any>(ANS_KEY);
    
    quiz.questions = allQuestions
      .filter(q => q.quiz_id === qRaw.id)
      .map(q => mapQuestion(q, allAnswers));
  }

  return quiz;
};

// --- REPOSITORY ---

export const JsonQuizRepository: IQuizRepository = {
  async findAll(): Promise<Quiz[]> {
    await new Promise(res => setTimeout(res, 400));
    const rawData = db.get<any>(QUIZ_KEY);
    return rawData.map(q => mapQuiz(q, false));
  },

  async findById(id: number): Promise<Quiz | null> {
    const rawData = db.get<any>(QUIZ_KEY);
    const found = rawData.find(q => q.id === id);
    return found ? mapQuiz(found, true) : null;
  },

  async findByCategory(categoryId: number): Promise<Quiz[]> {
    const rawData = db.get<any>(QUIZ_KEY);
    return rawData
      .filter(q => q.category_id === categoryId)
      .map(q => mapQuiz(q, false));
  },

  async search(query: string): Promise<Quiz[]> {
    const rawData = db.get<any>(QUIZ_KEY);
    const lowQuery = query.toLowerCase();
    
    return rawData
      .filter(q => 
        q.title.toLowerCase().includes(lowQuery) || 
        q.description?.toLowerCase().includes(lowQuery)
      )
      .map(q => mapQuiz(q, false));
  },

  async findAllCategories(): Promise<Category[]> {
    const rawData = db.get<any>(CAT_KEY);
    return rawData.map(mapCategory);
  },

  async getCategoryById(id: number): Promise<Category | null> {
    const rawCats = db.get<any>(CAT_KEY);
    const found = rawCats.find(c => c.id === id);
    return found ? mapCategory(found) : null;
  }
};